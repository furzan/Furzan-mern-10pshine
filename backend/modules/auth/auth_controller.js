const bcrypt = require('bcrypt')
const db = require('../../models')
const jwt = require('jsonwebtoken')
const sendEmail = require('../../utils/send_email');
const crypto = require('crypto')
const logger = require('../../utils/logger');

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;


//Register a new user
// Expects: { f_name, l_name, email, password }
 
async function register(req, res) {
  try {
    const { f_name, l_name, email, password } = req.body || {};

    const errors = [];
    if (!f_name || typeof f_name !== 'string' || !f_name.trim()) errors.push('First name is required')
    if (!l_name || typeof l_name !== 'string' || !l_name.trim()) errors.push('Last name is required')
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('A valid email is required');
    if (!password || typeof password !== 'string' || password.length < 8) errors.push('Password is required and should be at least 8 characters');

    if (errors.length) {
      return res.status(400).json({ ok: false, errors });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await db.User.findOne({ where: { email: normalizedEmail } })
    if (existing) {
      return res.status(409).json({ ok: false, message: 'Email already in use' })
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);


    const user = await db.User.create({
      f_name: f_name.trim(),
      l_name: l_name.trim(),
      email: normalizedEmail,
      password_hash
    });

    logger.info({ userId: user.id, email: normalizedEmail }, 'User registered successfully');
   
    return res.status(201).json({
      ok: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        f_name: user.f_name,
        l_name: user.l_name,
        email: user.email,
        created_at: user.created_at || user.createdAt
      }
    });
  } catch (err) {
    
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ ok: false, message: 'Email already in use' })
    }

    logger.error({ err, email: normalizedEmail }, 'Register error');

    return res.status(500).json({ ok: false, message: 'Internal server error' })
  }
}



//Login existing user
//Expects: { email, password }
 
async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    const errors = [];
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('A valid email is required')
    if (!password || typeof password !== 'string' || !password.length) errors.push('Password is required')

    logger.info({ email }, 'Login attempt');

    if (errors.length) return res.status(400).json({ ok: false, errors })

    const normalizedEmail = email.trim().toLowerCase()

    const user = await db.User.findOne({ 
        where: { email: normalizedEmail } 
    })

    if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ ok: false, message: 'Invalid credentials' })

    let jwtSecret = process.env.JWT_SECRET || process.env.SECRET || null;
    if (!jwtSecret) {
        console.warn('JWT secret not set in environment variables.')
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' })

    logger.info({ userId: user.id, email }, 'User logged in successfully');
    
    try {
      await user.update({ token: token })
      await user.update({ last_login: new Date() });
    } catch (updateErr) {
      console.warn('Failed to update last_login:', updateErr && updateErr.message)
    }

    

    return res.status(200).json({
      ok: true,
      message: 'Authenticated',
      token,
      user: {
        id: user.id,
        f_name: user.f_name,
        l_name: user.l_name,
        email: user.email,
        last_login: user.last_login
      }
    })

  } catch (err) {
    logger.error({ err, email: req.body.email }, 'Login error');
    return res.status(500).json({ ok: false, message: 'Internal server error' })
  }
}


//Logout existing user
//Expects: { email }

async function logout(req, res) {
  try {
    const { email } = req.body || {};

    const errors = [];
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('A valid email is required')

    if (errors.length) return res.status(400).json({ ok: false, errors })

    const normalizedEmail = email.trim().toLowerCase()

    const user = await db.User.findOne({ 
        where: { email: normalizedEmail } 
    })

    if (!user) return res.status(401).json({ ok: false, message: 'User not found' })
    
    try {
      await user.update({ token: null })
    } catch (updateErr) {
      console.warn('Error logging out:', updateErr && updateErr.message)
    }

    logger.info({ userId: user.id, email: normalizedEmail }, 'User logged out successfully');

    return res.status(200).json({
      ok: true,
      message: 'Logged out',
    })

  } catch (err) {
    logger.error({ err, email: normalizedEmail }, 'Logout error');
    return res.status(500).json({ ok: false, message: 'Internal server error' })
  }
}

// Request password reset
// Expects: { email } 

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body || {};
    const errors = [];
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('A valid email is required');
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.User.findOne({ where: { email: normalizedEmail } });

    // Security: Always return success even if user doesn't exist
    if (!user) {
      return res.status(200).json({ ok: true, message: 'If that email exists, a reset link has been sent' });
    }

    const token = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 1. Save token to DB
    await user.update({ 
      reset_token: token, 
      reset_token_expires: expires 
    });

    // 2. Construct the link
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontend.replace(/\/$/, '')}/forgotpass/${email}`;

    // 3. Send the email
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'Password Reset Request',
        html: `
              <div style="background-color: #f9f9f9; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <div style="max-width: 500px; background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                        
                        <div style="background-color: #FFB347; padding: 20px; text-align: center;">
                          <span style="font-size: 24px; font-weight: bold; color: white;">Notes App</span>
                        </div>

                        <div style="padding: 40px 30px; text-align: center;">
                          <h2 style="margin-top: 0; color: #1a1a1a; font-size: 22px;">Password Reset</h2>
                          <p style="color: #666666; font-size: 16px; margin-bottom: 25px;">
                            You requested a password reset. Click the button below to continue:
                          </p>
                          
                          <div style="margin-bottom: 30px;">
                            <a href="${resetLink}" 
                              style="background-color: #FFB347; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                              Reset Password
                            </a>
                          </div>

                          <div style="border-top: 1px solid #eeeeee; padding-top: 30px; margin-top: 30px;">
                            <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">Reset token:</p>
                            <div style="background-color: #fff9f0; border: 2px dashed #FFB347; padding: 15px 20px; border-radius: 8px; display: inline-block;">
                              <span style="font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: bold; color: #d48806; letter-spacing: 4px;">
                                ${token}
                              </span>
                            </div>
                          </div>

                          <p style="color: #999999; font-size: 13px; margin-top: 30px;">
                            This token and link are valid for <strong>1 hour</strong>.
                          </p>
                        </div>

                        <div style="padding: 20px 30px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: left;">
                          <p style="margin: 0; font-size: 12px; color: #999999; word-break: break-all;">
                            Direct Link: <a href="${resetLink}" style="color: #FFB347; text-decoration: none;">${resetLink}</a>
                          </p>
                        </div>
                      </div>

                      <p style="margin-top: 20px; font-size: 12px; color: #bbbbbb; text-align: center;">
                        Sent with ❤️ by the Notes App Team
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
        `
      });
    } catch (mailErr) {
      // 4. Rollback: If email fails, clear the token from DB
      await user.update({ reset_token: null, reset_token_expires: null });
      console.error('Email send failure:', mailErr);
      return res.status(500).json({ ok: false, message: 'Failed to send reset email. Please try again later.' });
    }

    logger.info({ userId: user.id, email: normalizedEmail }, 'Password reset requested successfully');

    return res.status(200).json({ ok: true, message: 'If that email exists, a reset link has been sent' });

  } catch (err) {
    logger.error({ err, email: normalizedEmail }, 'RequestPasswordReset error');
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
}


// Reset password
// Expects: { email, token, new_password }
async function resetPassword(req, res) {
  try {
    const { email, token, new_password } = req.body || {};
    const errors = [];
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('A valid email is required')
    if (!token || typeof token !== 'string' || !token.length) errors.push('Reset token is required')
    if (!new_password || typeof new_password !== 'string' || new_password.length < 8) errors.push('Password is required and should be at least 8 characters')
    if (errors.length) return res.status(400).json({ ok: false, errors })

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.User.findOne({ where: { email: normalizedEmail } });
    if (!user) return res.status(400).json({ ok: false, message: 'Invalid token or email' })

    if (!user.reset_token || user.reset_token !== token) return res.status(400).json({ ok: false, message: 'Invalid token or email' })
    if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) return res.status(400).json({ ok: false, message: 'Reset token expired' })

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(new_password, saltRounds);

    try {
      await user.update({ password_hash, reset_token: null, reset_token_expires: null });
    } catch (updateErr) {
      console.warn('Failed to update password:', updateErr && updateErr.message)
      return res.status(500).json({ ok: false, message: 'Failed to reset password' })
    }

    logger.info({ userId: user.id, email: normalizedEmail }, 'Password reset successfully');

    return res.status(200).json({ ok: true, message: 'Password has been reset' })
  } catch (err) {
    logger.error({ err, email: normalizedEmail }, 'ResetPassword error');
    return res.status(500).json({ ok: false, message: 'Internal server error' })
  }
}

// {expects req.user after middleware has processed the jwt token}
const checkUserAuth = (req, res) => {
  if (req.user) {
    logger.info({ userId: req.user.id, email: req.user.email }, 'User authentication check passed');
    return res.status(200).json({ 
      ok: true, 
      message: 'User is authenticated',
    });
  } else {
    logger.info('User authentication check failed');
    return res.status(401).json({ 
      status: 'error', 
      message: 'Unauthorized: No user found' 
    });
  }
};



module.exports = {
  register,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
  checkUserAuth
}
