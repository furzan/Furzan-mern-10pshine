import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import FormInput from '../components/FormInput'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('SignIn submit', { email, password })
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
        <FormInput label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormInput label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="#" className="small">
            Forgot password?
          </Link>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Sign In</button>
        </div>
      </form>
    </AuthCard>
    </>
  )
}
