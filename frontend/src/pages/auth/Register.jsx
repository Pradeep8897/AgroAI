import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Settings, Server, Mail, Lock, UserPlus } from 'lucide-react'
import { registerUser, loginUser } from '../../services/authService'
import { useAuth } from '../../App'

export default function Register() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('agroai_backend_url') || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    
    setLoading(true)
    
    // Auto-generate username from email prefix (e.g. "you@example.com" -> "you")
    const username = formData.email.split('@')[0]
    
    try {
      const data = await registerUser(username, formData.email, formData.password)
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
      <div style={styles.box}>
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
          <div>
            {/* Top Logo Badge */}
            <div style={styles.topLogoBox}>
              <UserPlus size={24} color="#ffffff" />
            </div>

            <h3 style={styles.settingsTitle}>
              <Server size={16} color="#16a34a" /> Server Connection
            </h3>
            <p style={styles.settingsSubtitle}>
              Specify the host domain of your deployed backend server (e.g. <code>https://agroai-9ibe.onrender.com</code>).
            </p>
            
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={styles.inputLabel}>Backend API URL</label>
              <input 
                type="text" 
                style={styles.fieldInputSolo}
                placeholder="E.g., https://agroai-9ibe.onrender.com"
                value={backendUrl} 
                onChange={e => setBackendUrl(e.target.value)} 
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              <button 
                type="button"
                style={styles.saveBtn}
                onClick={handleSaveBackendUrl}
              >
                Save
              </button>
              <button 
                type="button"
                style={styles.resetBtn}
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
              style={styles.backBtn} 
              onClick={() => setShowSettings(false)}
            >
              Back to Register
            </button>
          </div>
        ) : (
          <>
            {/* Top Logo Badge */}
            <div style={styles.topLogoBox}>
              <UserPlus size={24} color="#ffffff" />
            </div>

            <h1 style={styles.title}>Create your account</h1>
            <p style={styles.subtitle}>Sign up to get started</p>

            {error && (
              <div style={styles.errorAlert}>
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              type="button"
              style={styles.googleBtn}
              onClick={() => alert("Demo: Google Authentication is set up for production. Please use Email/Password for testing.")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 10 }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider OR */}
            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>OR</span>
              <div style={styles.dividerLine} />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Email</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="#9ca3af" style={styles.inputIcon} />
                  <input
                    type="email"
                    style={styles.fieldInput}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    style={styles.fieldInput}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    style={styles.eyeBtnInside}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    style={styles.fieldInput}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    style={styles.eyeBtnInside}
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" style={styles.registerBtn} disabled={loading} id="register-submit-btn">
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
                    Creating...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p style={styles.bottomText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.loginLink}>Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
    position: 'relative',
    fontFamily: "'Outfit', sans-serif",
  },
  box: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 24,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.07)',
    position: 'relative',
    zIndex: 1,
  },
  topLogoBox: {
    width: 48,
    height: 48,
    backgroundColor: '#15803d',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    textAlign: 'center',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: '0.95rem',
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 28,
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: 16,
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0 20px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    padding: '0 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#9ca3af',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
  },
  fieldInput: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 12,
    color: '#1f2937',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  fieldInputSolo: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 12,
    color: '#1f2937',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  eyeBtnInside: {
    position: 'absolute',
    right: 14,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtn: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#15803d',
    color: '#ffffff',
    border: 'none',
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: '0.88rem',
    color: '#6b7280',
  },
  loginLink: {
    color: '#15803d',
    fontWeight: 600,
    textDecoration: 'none',
  },
  settingsBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: 6,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  settingsTitle: {
    fontSize: '1.1rem',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  settingsSubtitle: {
    fontSize: '0.78rem',
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  saveBtn: {
    padding: '10px 16px',
    backgroundColor: '#15803d',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
  },
  resetBtn: {
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
  },
  backBtn: {
    width: '100%',
    marginTop: 12,
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorAlert: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: 12,
    color: '#ef4444',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: 20,
    textAlign: 'center',
  },
}
