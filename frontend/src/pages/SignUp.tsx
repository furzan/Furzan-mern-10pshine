import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/auth_Apis";
import { useNavigate } from "react-router-dom";

type Errors = Partial<
  Record<"firstName" | "lastName" | "email" | "password", string>
>;
import "../styles/SignUp.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validate = () => {
    const e: Errors = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      setLoading(true);
      try {
        const response = await signup({
          f_name: firstName,
          l_name: lastName,
          email: email,
          password: password,
        });

        if (response.ok == true) navigate("/signin");
        console.log("Sign up attempted with:", { firstName, lastName, email, password });
      } catch (error) {
        console.error("Signup failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side - Image Section */}
      <div className="signup-left">
        <div className="brand-section">
          <div className="logo-box">📝</div>
          <h1>Notes App</h1>
        </div>
        
        <div className="hero-content">
          <h2 className="hero-title">
            Start your journey<br />
            <span className="hero-subtitle-light">to better organization</span>
          </h2>
          <p className="hero-subtitle">
            Join thousands of users who trust Notes App to keep their thoughts organized and accessible.
          </p>
        </div>

        <div className="decorative-emoji">🚀</div>
      </div>

      {/* Right Side - Form Section */}
      <div className="signup-right">
        <div className="form-container">
          <div className="brand-logo">
            <div className="logo-circle">📝</div>
            <span className="brand-name">Notes App</span>
          </div>

          <div className="welcome-section">
            <h1 className="welcome-title">Create account</h1>
            <p className="welcome-subtitle">Get started with your free account</p>
          </div>

          <form onSubmit = {handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First name</label>
                <input
                  type="text"
                  id="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="signin-section">
            <p className="signin-text">
              Already have an account?{' '}
              <Link to = "/signin" className="signin-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
