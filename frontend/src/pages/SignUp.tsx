import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import { signup } from "../services/auth_Apis";
import { useNavigate } from "react-router-dom";

type Errors = Partial<
  Record<"firstName" | "lastName" | "email" | "password", string>
>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();

  function validate(): Errors {
    const e: Errors = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const v = validate();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      try {
        const response = await signup({
          f_name: firstName,
          l_name: lastName,
          email: email,
          password: password,
        });

        if (response.ok == true) navigate("/signin");
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  }

  return (
    <>
      <div className="app-title-container">
        <h1 className="app-title">Notes App</h1>
      </div>
      <AuthCard
        title="Create account"
        footer={
          <small>
            Already have an account? <Link to="/signin">Sign In</Link>
          </small>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6">
              <FormInput
                label="First name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName || null}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Last name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName || null}
              />
            </div>
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email || null}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password || null}
          />

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
      </AuthCard>
    </>
  );
}
