import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthCard({ title, children, footer }: Props) {
  return (
    <div className="d-flex justify-content-center align-items-center auth-page">
      <div className="card auth-card shadow-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-header bg-gradient border-0 pt-5 pb-4">
          <h2 className="card-title text-center mb-0 fw-bold text-white">{title}</h2>
        </div>
        <div className="card-body px-4 py-5">
          {children}
        </div>
        {footer && (
          <div className="card-footer bg-light border-top-0 text-center py-4">
            <small className="text-muted">{footer}</small>
          </div>
        )}
      </div>
    </div>
  )
}
