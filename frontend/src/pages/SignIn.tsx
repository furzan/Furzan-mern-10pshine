import { useState } from "react";
import { Link } from "react-router-dom";
import { signin } from "../services/auth_Apis";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signin({
        email: email,
        password: password,
      });

      if (response.ok == true) {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        navigate("/dashboard");
      }
      
      console.log("Sign in attempted with:", { email, password });
    } catch (error) {
      console.error("SignIn error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {/* Left Side - Image Section */}
      <div className="signin-left">
        <div className="brand-section">
          <div className="logo-box">📝</div>
          <h1>Notes App</h1>
        </div>
        
        <div className="hero-content">
          <h2 className="hero-title">
            Organize your life,<br />
            <span className="hero-subtitle-light">one note at a time</span>
          </h2>
          <p className="hero-subtitle">
            Your ideas deserve a beautiful home. Create, organize, and access your notes from anywhere.
          </p>
        </div>

        <div className="decorative-emoji">✍️</div>
      </div>

      {/* Right Side - Form Section */}
      <div className="signin-right">
        <div className="form-container">
          <div className="brand-logo">
            <div className="logo-circle">📝</div>
            <span className="brand-name">Notes App</span>
          </div>

          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back!</h1>
            <p className="welcome-subtitle">Sign in to continue to your notes</p>
          </div>

          <div className="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to = '/forgotpass' className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="signup-section">
            <p className="signup-text">
              Don't have an account?{' '}
              <Link to = "/signup" className="signup-link">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}