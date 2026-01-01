const bcrypt = require('bcrypt')
const db = require('../../models')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

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

    console.error('Register error:', err);
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

    if (errors.length) return res.status(400).json({ ok: false, errors })

    const normalizedEmail = email.trim().toLowerCase()

    const user = await db.User.findOne({ 
        where: { email: normalizedEmail } 
    })

    if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ ok: false, message: 'Invalid credentials' })

    
    try {
     
      await user.update({ last_login: new Date() });
    } catch (updateErr) {
      console.warn('Failed to update last_login:', updateErr && updateErr.message)
    }

    
    let jwtSecret = process.env.JWT_SECRET || process.env.SECRET || null;
    if (!jwtSecret) {
        console.warn('JWT secret not set in environment variables.')
    }
    
    const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' })

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
    console.error('Login error:', err);
    return res.status(500).json({ ok: false, message: 'Internal server error' })
  }
}



module.exports = {
    register,
    login
}