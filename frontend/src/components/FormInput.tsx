import React from 'react'

type Props = {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string | null
}

export default function FormInput({ label, name, type = 'text', value, onChange, error }: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label fw-semibold text-dark mb-2 d-block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control form-input-modern ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {error && <div className="invalid-feedback d-block mt-2 small">{error}</div>}
    </div>
  )
}
