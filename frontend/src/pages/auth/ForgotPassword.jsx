import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Mail, Loader2 } from 'lucide-react'
import { API_BASE } from '../../services/apiConfig'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email) {
      setError('Email is required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessage(data.message || 'Password reset instructions have been sent to your email.')
        setEmail('')
      } else {
        setError(data.message || 'Failed to send reset link.')
      }
    } catch (err) {
      setError('Cannot connect to server. Please ensure the backend is running.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)', padding: 24 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 440, backdropFilter: 'blur(16px)' }} className="animate-scale-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={20} color="#22c55e" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>Agro<span style={{ color: '#22c55e' }}>AI</span></span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Mail size={28} color="#3b82f6" />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Forgot Password?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Enter your email and we'll send a reset link.</p>
        </div>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success" style={{ marginBottom: 20, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '12px 16px', borderRadius: 12, fontSize: '0.875rem' }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com" 
              id="forgot-email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" id="forgot-submit-btn" disabled={loading}>
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />Sending...</> : 'Send Reset Link'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link to="/login" style={{ color: '#22c55e', fontWeight: 600 }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
