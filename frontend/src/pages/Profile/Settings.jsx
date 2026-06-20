import React, { useState } from 'react'
import { Settings as SettingsIcon, User, Globe, Bell, Shield, Phone, HelpCircle, Server } from 'lucide-react'

export default function Settings() {
  const [lang, setLang] = useState('English')
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('agroai_backend_url') || ''
  })
  const [profile, setProfile] = useState({
    name: 'Pradeep Kumar',
    phone: '+91 98765 43210',
    state: 'Punjab',
    district: 'Ludhiana'
  })
  
  const [notifs, setNotifs] = useState({
    weather: true,
    mandi: true,
    orders: false,
    assistant: true
  })

  const handleTestNotification = () => {
    if (window.AndroidBridge && typeof window.AndroidBridge.showNotification === 'function') {
      window.AndroidBridge.showNotification(
        "🌾 AgroAI Alert", 
        "Wheat market rates in Ludhiana increased by ₹45/quintal. Tap to review forecasts!"
      )
    } else {
      alert("Test alert: This feature is active when running inside the native AgroAI Android App!")
    }
  }

  const handleSaveBackendUrl = () => {
    const trimmedUrl = backendUrl.trim()
    if (trimmedUrl) {
      localStorage.setItem('agroai_backend_url', trimmedUrl)
    } else {
      localStorage.removeItem('agroai_backend_url')
    }
    
    if (window.AndroidBridge && typeof window.AndroidBridge.showToast === 'function') {
      window.AndroidBridge.showToast("Backend URL saved! Reloading...")
    } else {
      alert("Backend URL saved! Reloading...")
    }
    
    setTimeout(() => {
      window.location.reload()
    }, 800)
  }

  const handleToggle = (key) => {
    setNotifs(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      if (window.AndroidBridge && typeof window.AndroidBridge.showToast === 'function') {
        window.AndroidBridge.showToast("Settings updated successfully!")
      }
      return updated
    })
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div className="page-header">
        <h1>⚙️ App Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your farming profile, preferred languages, and push notifications.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Section 1: Farmer Profile */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="var(--color-primary-dark)" /> Farmer Profile Settings
          </h3>
          
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={profile.phone} 
                onChange={e => setProfile({...profile, phone: e.target.value})} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State</label>
              <input 
                type="text" 
                className="form-input" 
                value={profile.state} 
                onChange={e => setProfile({...profile, state: e.target.value})} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">District</label>
              <input 
                type="text" 
                className="form-input" 
                value={profile.district} 
                onChange={e => setProfile({...profile, district: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Language Configuration */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="var(--color-info)" /> App Language / भाषा
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            Choose your preferred language for voice assistant responses and crop reports.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
            {['English', 'हिंदी (Hindi)', 'ਪੰਜਾਬੀ (Punjabi)', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)', 'বাংলা (Bengali)'].map(l => {
              const active = lang === l
              return (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l)
                    if (window.AndroidBridge && typeof window.AndroidBridge.showToast === 'function') {
                      window.AndroidBridge.showToast(`Language set to ${l.split(' ')[0]}`)
                    }
                  }}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: active ? 'var(--color-primary-glow)' : 'var(--bg-dark)',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    color: active ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {l}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 3: Notification Rules */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="var(--color-warning)" /> Push Alerts & Notifications
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Toggle notification categories delivered to your mobile status bar.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'weather', label: 'Weather Warnings', desc: 'Alerts regarding upcoming frost, heavy rain, or storms.' },
              { key: 'mandi', label: 'Mandi Price Spikes', desc: 'Daily market notifications for registered key crops.' },
              { key: 'orders', label: 'Marketplace & Booking status', desc: 'Updates on seed deliveries and rental machine approvals.' },
              { key: 'assistant', label: 'AI Advisory Reminders', desc: 'Weekly custom fertilizer schedules and soil action tasks.' }
            ].map(item => (
              <div 
                key={item.key} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'var(--bg-dark)',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ paddingRight: 16 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                
                {/* Custom Checkbox Toggle */}
                <button
                  onClick={() => handleToggle(item.key)}
                  style={{
                    width: 46,
                    height: 24,
                    borderRadius: 12,
                    background: notifs[item.key] ? 'var(--color-primary)' : 'var(--text-dim)',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 3,
                    left: notifs[item.key] ? 25 : 3,
                    transition: 'left 0.2s'
                  }} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '20px 0' }} />

          {/* Test notifications */}
          <button 
            className="btn btn-secondary btn-block" 
            onClick={handleTestNotification}
            id="btn-test-notification"
            style={{ fontSize: '0.85rem', padding: '10px 16px', width: '100%' }}
          >
            🔔 Send Test Mobile Notification
          </button>
        </div>

        {/* Section 4: Backend API Server Settings */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Server size={18} color="var(--color-info)" /> Backend Connection Settings
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            Specify the host domain of your deployed backend server (e.g. <code>https://agroai-9ibe.onrender.com</code>).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Backend API URL</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., https://agroai-9ibe.onrender.com"
                value={backendUrl} 
                onChange={e => setBackendUrl(e.target.value)} 
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveBackendUrl}
                style={{ fontSize: '0.85rem', padding: '10px 16px' }}
              >
                💾 Save Connection
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setBackendUrl('')
                  localStorage.removeItem('agroai_backend_url')
                  if (window.AndroidBridge && typeof window.AndroidBridge.showToast === 'function') {
                    window.AndroidBridge.showToast("Connection reset to default. Reloading...")
                  } else {
                    alert("Connection reset to default. Reloading...")
                  }
                  setTimeout(() => window.location.reload(), 800)
                }}
                style={{ fontSize: '0.85rem', padding: '10px 16px' }}
              >
                🔄 Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Diagnostics */}
        <div className="card" style={{ background: 'var(--bg-dark)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={16} color="var(--text-muted)" /> Diagnostic Information
          </h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div>App Version: 1.0.4 (AgroAI Wrapper Stable)</div>
            <div>Bridge Connection: {window.AndroidBridge ? "CONNECTED (Native App)" : "DISCONNECTED (Web Browser)"}</div>
            <div>User Agent: {navigator.userAgent.includes('AgroAI-Android') ? "AgroAI-Android Client" : "Standard Web browser"}</div>
            <div>API Base Address: {localStorage.getItem('agroai_backend_url') || (window.AndroidBridge ? "Bridge Dynamic" : "Local Emulator Loopback")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

