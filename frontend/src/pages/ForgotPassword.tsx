import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { forgotpassword, resetpassword } from '../services/auth_Apis'
import "../styles/ForgotPassword.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<
  Record<"email" | "token" | "newPassword" | "confirmPassword", string>
>;

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: reset
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { email_param } = useParams();

  useEffect(() => {
    if (email_param ) {
      setEmail(email_param)
      setStep(2);
    }
    else if (sessionStorage.getItem('forgotpass_email')) {
      setEmail(sessionStorage.getItem('forgotpass_email') || '')
      setStep(2);
    }
  }, [email_param]);

  const validateEmail = () => {
    const e: Errors = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Enter a valid email.";
    return e;
  };

  const validateReset = () => {
    const e: Errors = {};
    if (!token.trim()) e.token = "Token is required.";
    if (!newPassword) e.newPassword = "New password is required.";
    else if (newPassword.length < 6) e.newPassword = "Password must be at least 6 characters.";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateEmail();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      setLoading(true);
      try {
        sessionStorage.setItem('forgotpass_email', email);
        await forgotpassword(email)
        console.log("Password reset requested for:", email);
        setStep(2);
      } catch (error) {
        console.error("Failed to send reset email:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateReset();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      setLoading(true);
      try {
        await resetpassword(email, newPassword, token )
        console.log("Password reset:", { email, token, newPassword });
      } catch (error) {
        console.error("Failed to reset password:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendToken = async () => {
    setResendLoading(true);
    try {
      await forgotpassword(email)
      console.log("Token resent to:", email);
    } catch (error) {
      console.error("Failed to resend token:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Left Side - Image Section */}
      <div className="forgot-left">
        <div className="brand-section">
          <div className="logo-box">📝</div>
          <h1>Notes App</h1>
        </div>
        
        <div className="hero-content">
          <h2 className="hero-title">
            Don't worry,<br />
            <span className="hero-subtitle-light">it happens to everyone</span>
          </h2>
          <p className="hero-subtitle">
            We'll help you get back to your notes in no time. Just follow the simple steps.
          </p>
        </div>

        <div className="decorative-emoji">🔐</div>
      </div>

      {/* Right Side - Form Section */}
      <div className="forgot-right">
        <div className="form-container">
          <div className="brand-logo">
            <div className="logo-circle">📝</div>
            <span className="brand-name">Notes App</span>
          </div>

          {step === 1 ? (
            <>
              <div className="welcome-section">
                <h1 className="welcome-title">Forgot password?</h1>
                <p className="welcome-subtitle">Enter your email and we'll send you a reset token</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="forgot-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Token"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="welcome-section">
                <h1 className="welcome-title">Reset password</h1>
                <p className="welcome-subtitle">
                  Enter the token sent to <strong className="email-highlight">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleResetSubmit} className="forgot-form">
                <div className="form-group">
                  <div className="token-header">
                    <label htmlFor="token" className="form-label">Reset Token</label>
                    <button
                      type="button"
                      onClick={handleResendToken}
                      disabled={resendLoading}
                      className="resend-button"
                    >
                      {resendLoading ? "Sending..." : "Resend token"}
                    </button>
                  </div>
                  <input
                    type="text"
                    id="token"
                    className={`form-input token-input ${errors.token ? 'error' : ''}`}
                    placeholder="Enter 6-digit token"
                    value={token}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
                    maxLength={6}
                  />
                  {errors.token && (
                    <span className="error-message">{errors.token}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <div className="signin-section">
            <p className="signin-text">
              Remember your password?{' '}
              <Link to = "/signin" className="signin-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}