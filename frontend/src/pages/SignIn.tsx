import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import { signin } from "../services/auth_Apis";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await signin({
        email: email,
        password: password,
      });

      if (response.ok == true) {
        console.log("SignIn success", response);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("SignIn error:", error);
    }
  }

  return (
    <>
      <div className="app-title-container">
        <h1 className="app-title">Notes App</h1>
      </div>
      <AuthCard
        title="Sign In"
        footer={
          <>
            <small>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </small>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="#" className="small">
              Forgot password?
            </Link>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </div>
        </form>
      </AuthCard>
    </>
  );
}
