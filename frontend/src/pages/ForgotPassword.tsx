import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import { Link } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: reset
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const validateEmail = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Enter a valid email.";
    return e;
  };

  const validateReset = () => {
    const e = {};
    if (!token.trim()) e.token = "Token is required.";
    if (!newPassword) e.newPassword = "New password is required.";
    else if (newPassword.length < 6) e.newPassword = "Password must be at least 6 characters.";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const v = validateEmail();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      setLoading(true);
      try {
        // Replace with your actual forgot password API call
        // const response = await requestPasswordReset({ email });
        // if (response.ok) setStep(2);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Password reset requested for:", email);
        setStep(2);
      } catch (error) {
        console.error("Failed to send reset email:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const v = validateReset();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      setLoading(true);
      try {
        // Replace with your actual password reset API call
        // const response = await resetPassword({ email, token, newPassword });
        // if (response.ok) navigate("/signin");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      // Replace with your actual resend token API call
      // const response = await resendResetToken({ email });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Token resent to:", email);
    } catch (error) {
      console.error("Failed to resend token:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Left Side - Image Section */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%), url("https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        color: 'white',
      }}
      className="forgot-left-panel"
      >
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}>
              <span style={{
                fontSize: '1.25rem',
              }}>📝</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: '0',
              letterSpacing: '0.5px',
            }}>
              Notes App
            </h1>
          </div>
        </div>
        
        <div style={{
          marginBottom: '4rem',
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '700',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.2',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
          }}>
            Don't worry,<br />
            <span style={{ 
              fontWeight: '300',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0e6ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>it happens to everyone</span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: '0.95',
            margin: '0',
            fontWeight: '400',
            lineHeight: '1.6',
            maxWidth: '500px',
          }}>
            We'll help you get back to your notes in no time. Just follow the simple steps.
          </p>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          right: '3rem',
          opacity: '0.1',
          fontSize: '200px',
          lineHeight: '1',
          pointerEvents: 'none',
        }}>
          🔐
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div style={{
        flex: '1',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minWidth: '0',
      }}
      className="forgot-right-panel"
      >
        <div style={{
          width: '100%',
          maxWidth: '440px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            }}>
              <span style={{
                fontSize: '1.5rem',
              }}>📝</span>
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Notes App
            </span>
          </div>

          {step === 1 ? (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  margin: '0 0 0.5rem 0',
                  color: '#1a1a1a',
                }}>
                  Forgot password?
                </h1>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#999',
                  margin: '0',
                }}>
                  Enter your email and we'll send you a reset token
                </p>
              </div>

              <div onSubmit={handleEmailSubmit}>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '0.5rem',
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      border: `2px solid ${errors.email ? '#e74c3c' : '#e0e0e0'}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.email && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#e74c3c',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: loading ? '0.7' : '1',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Token"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  margin: '0 0 0.5rem 0',
                  color: '#1a1a1a',
                }}>
                  Reset password
                </h1>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#999',
                  margin: '0',
                }}>
                  Enter the token sent to <strong>{email}</strong>
                </p>
              </div>

              <div onSubmit={handleResetSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}>
                    <label style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#333',
                    }}>
                      Reset Token
                    </label>
                    <button
                      type="button"
                      onClick={handleResendToken}
                      disabled={resendLoading}
                      style={{
                        fontSize: '0.875rem',
                        color: '#667eea',
                        background: 'none',
                        border: 'none',
                        cursor: resendLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        padding: '0',
                        textDecoration: 'underline',
                        opacity: resendLoading ? '0.6' : '1',
                      }}
                    >
                      {resendLoading ? "Sending..." : "Resend token"}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      border: `2px solid ${errors.token ? '#e74c3c' : '#e0e0e0'}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      letterSpacing: '0.5em',
                      textAlign: 'center',
                    }}
                    maxLength={6}
                    onFocus={(e) => {
                      if (!errors.token) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.token) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.token && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#e74c3c',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}>
                      {errors.token}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '0.5rem',
                  }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      border: `2px solid ${errors.newPassword ? '#e74c3c' : '#e0e0e0'}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      if (!errors.newPassword) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.newPassword) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.newPassword && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#e74c3c',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}>
                      {errors.newPassword}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '0.5rem',
                  }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      border: `2px solid ${errors.confirmPassword ? '#e74c3c' : '#e0e0e0'}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      if (!errors.confirmPassword) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.confirmPassword) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.confirmPassword && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#e74c3c',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleResetSubmit}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: loading ? '0.7' : '1',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </>
          )}

          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#666',
              margin: '0',
            }}>
              Remember your password?{' '}
              <Link
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
                to="/signin"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .forgot-left-panel {
            display: none !important;
          }
          .forgot-right-panel {
            flex: 1;
          }
        }
        
        @media (max-width: 640px) {
          .forgot-right-panel {
            padding: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .forgot-right-panel {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}