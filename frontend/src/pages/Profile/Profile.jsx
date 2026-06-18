import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../App'
import { User, Phone, MapPin, Compass, LogOut, Loader2, Save } from 'lucide-react'
import { API_BASE } from '../../services/apiConfig'

export default function Profile() {
  const { user, token, login, logout } = useAuth()
  const navigate = useNavigate()

  // State variables for form fields
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    location: '',
    state: '',
    farm_size: '',
    language: 'english',
  })

  // Load user profile details on mount
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/auth/profile?user_id=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success && data.user) {
          setForm({
            username: data.user.username || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            location: data.user.location || '',
            state: data.user.state || '',
            farm_size: data.user.farm_size || '',
            language: data.user.language || 'english',
          })
        }
      } catch (err) {
        console.error("Failed to load user profile", err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user?.id, token])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          user_id: user?.id
        })
      })
      const data = await res.json()
      if (data.success && data.user) {
        // Update global auth context
        login(data.user, token)
        setMessage('Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(data.message || 'Failed to update profile.')
      }
    } catch (err) {
      setError('Backend unreachable. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.pageContainer}>
      {/* Profile Header Banner */}
      <div style={styles.profileBanner} className="animate-fade-in">
        <div style={styles.avatarCircle}>
          <User size={48} color="#ffffff" />
        </div>
        <h2 style={styles.bannerName}>{user?.username || 'AgroAI User'}</h2>
        <p style={styles.bannerEmail}>{user?.email || 'user@agroai.com'}</p>
        <span style={styles.roleBadge}>{user?.role || 'Farmer'}</span>
      </div>

      {/* Edit Profile Form Card */}
      <div style={styles.formCard} className="animate-fade-in stagger-1">
        <h3 style={styles.formCardTitle}>Edit Profile</h3>

        {message && <div style={styles.successAlert}>{message}</div>}
        {error && <div style={styles.errorAlert}>{error}</div>}

        {loading ? (
          <div style={styles.loadingState}>
            <Loader2 size={32} className="animate-spin" color="#22c55e" />
            <p style={{ marginTop: 10 }}>Loading profile details...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} style={styles.form}>
            {/* Phone */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <Phone size={14} style={{ marginRight: 6 }} /> Phone
              </label>
              <input 
                type="text" 
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                style={styles.formInput}
                placeholder="e.g. 6305302731"
                id="profile-phone"
              />
            </div>

            {/* Location */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <MapPin size={14} style={{ marginRight: 6 }} /> Location
              </label>
              <input 
                type="text" 
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                style={styles.formInput}
                placeholder="e.g. Nellore"
                id="profile-location"
              />
            </div>

            {/* State */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>State</label>
              <input 
                type="text" 
                value={form.state}
                onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                style={styles.formInput}
                placeholder="e.g. Andhrapradesh"
                id="profile-state"
              />
            </div>

            {/* Farm Size */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <Compass size={14} style={{ marginRight: 6 }} /> Farm Size (acres)
              </label>
              <input 
                type="number" 
                value={form.farm_size}
                onChange={e => setForm(p => ({ ...p, farm_size: e.target.value }))}
                style={styles.formInput}
                placeholder="e.g. 10"
                id="profile-farm-size"
              />
            </div>

            {/* Language */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Language</label>
              <select 
                value={form.language}
                onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                style={styles.formSelect}
                id="profile-language"
              >
                <option value="telugu">telugu</option>
                <option value="english">english</option>
                <option value="hindi">hindi</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={styles.saveBtn}
              disabled={submitting}
              id="profile-save-btn"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" style={{ marginRight: 6 }} />
              ) : (
                <Save size={16} style={{ marginRight: 6 }} />
              )}
              Save Profile
            </button>
          </form>
        )}
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        style={styles.logoutBtn} 
        id="profile-logout-btn"
        className="animate-fade-in stagger-2"
      >
        <LogOut size={16} style={{ marginRight: 6 }} />
        Logout
      </button>
    </div>
  )
}

const styles = {
  pageContainer: {
    background: '#040d08',
    borderRadius: 24,
    padding: 32,
    margin: '-16px',
    minHeight: 'calc(100vh - 120px)',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  profileBanner: {
    background: 'linear-gradient(135deg, #2e8b57 0%, #1e5e3a 100%)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bannerName: {
    fontSize: '1.5rem',
    fontWeight: 800,
    margin: '0 0 4px 0',
    color: '#ffffff',
  },
  bannerEmail: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 12px 0',
  },
  roleBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  formCard: {
    background: '#0c1b12',
    border: '1px solid #16301f',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
  },
  formCardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 20px 0',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    textAlign: 'left',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#a7f3d0',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
  },
  formInput: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Outfit, sans-serif',
  },
  formSelect: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a7f3d0\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '14px',
    appearance: 'none',
    fontFamily: 'Outfit, sans-serif',
  },
  saveBtn: {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
    transition: 'all 0.2s',
  },
  logoutBtn: {
    background: '#0c1b12',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: '12px',
    width: '100%',
    maxWidth: 500,
    color: '#ef4444',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  successAlert: {
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    color: '#a7f3d0',
    padding: 12,
    borderRadius: 10,
    fontSize: '0.88rem',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    padding: 12,
    borderRadius: 10,
    fontSize: '0.88rem',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0',
    color: '#a7f3d0',
  },
}

