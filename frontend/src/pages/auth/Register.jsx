import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Loader2, Settings, Server } from 'lucide-react'
import { registerUser, loginUser } from '../../services/authService'
import { useAuth } from '../../App'

export default function Register() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'farmer' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('agroai_backend_url') || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const data = await registerUser(formData.username, formData.email, formData.password)
      if (data.success) {
        // Auto-login after registration
        const loginData = await loginUser(formData.email, formData.password)
        if (loginData.success) {
          login(loginData.user, loginData.token)
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      } else {
        setError(data.message || 'Registration failed.')
      }
    } catch {
      setError('Cannot connect to server. Please ensure the backend is running.')
    }
    setLoading(false)
  }

  const handleSaveBackendUrl = () => {
    const trimmed = backendUrl.trim()
    if (trimmed) {
      localStorage.setItem('agroai_backend_url', trimmed)
    } else {
      localStorage.removeItem('agroai_backend_url')
    }
    alert("Backend URL saved! Reloading application...")
    window.location.reload()
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />
      <div style={styles.box} className="animate-scale-in">
        {/* Settings toggle button */}
        <button 
          type="button" 
          style={styles.settingsBtn} 
          onClick={() => setShowSettings(!showSettings)}
          title="Configure API Server URL"
        >
          <Settings size={18} />
        </button>

        {showSettings ? (
          <div className="animate-fade-in">
            {/* Logo */}
            <div style={styles.logoRow}>
              <div style={styles.logoIcon}><Leaf size={20} color="#22c55e" /></div>
              <span style={styles.logoText}>Agro<span style={{ color: '#22c55e' }}>AI</span></span>
            </div>

            <h3 style={{ fontSize: '1.1rem', textAlign: 'center', color: '#f0fdf4', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Server size={16} color="#22c55e" /> Server Connection
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20, textAlign: 'center' }}>
              Specify the IP address or host domain of your local Flask backend server (e.g. <code>http://192.168.x.x:5000</code>).
            </p>
            
            <div className="form-group">
              <label className="form-label">Backend API URL</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., http://192.168.1.15:5000"
                value={backendUrl} 
                onChange={e => setBackendUrl(e.target.value)} 
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={handleSaveBackendUrl}
              >
                Save
              </button>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => {
                  setBackendUrl('')
                  localStorage.removeItem('agroai_backend_url')
                  alert("Connection reset to default. Reloading...")
                  window.location.reload()
                }}
              >
                Reset
              </button>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-block" 
              style={{ marginTop: 12 }}
              onClick={() => setShowSettings(false)}
            >
              Back to Register
            </button>
          </div>
        ) : (
          <>
            <div style={styles.logoRow}>
              <div style={styles.logoIcon}><Leaf size={20} color="#22c55e" /></div>
              <span style={styles.logoText}>Agro<span style={{ color: '#22c55e' }}>AI</span></span>
            </div>

            <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 4 }}>Create Account</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 28 }}>
              Join thousands of farmers using AI-powered farming
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  id="register-username"
                  placeholder="Ramesh Kumar"
                  value={formData.username}
                  onChange={e => setFormData(p => ({ ...p, username: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  id="register-email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">I am a</label>
                <select
                  className="form-select"
                  id="register-role"
                  value={formData.role}
                  onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                >
                  <option value="farmer">Farmer</option>
                  <option value="agri_expert">Agricultural Expert</option>
                  <option value="vendor">Vendor / Supplier</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    id="register-password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} id="register-submit-btn">
                {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Create Free Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#22c55e', fontWeight: 600 }}>Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)', padding: 24, position: 'relative', overflow: 'hidden' },
  bgGlow1: { position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 65%)', pointerEvents: 'none' },
  bgGlow2: { position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 65%)', pointerEvents: 'none' },
  box: { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 440, backdropFilter: 'blur(16px)', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 },
  logoIcon: { width: 40, height: 40, background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 },
  settingsBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: 6,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
}
