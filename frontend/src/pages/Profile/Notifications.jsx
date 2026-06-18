import React, { useState, useEffect } from 'react'
import { Bell, TrendingUp, Bug, CloudRain, CheckCircle, Trash2, ArrowRight } from 'lucide-react'
import { API_BASE } from '../../services/apiConfig'
import { useAuth } from '../../App'

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'market',
    title: '📈 Tomato Market Price Surge!',
    desc: 'Tomato prices in Azadpur Mandi increased by 12% today. Average rate is now ₹2,150/quintal. Tap to review profit margins.',
    time: '2 hours ago',
    read: false,
    path: '/market-prices'
  },
  {
    id: 2,
    type: 'disease',
    title: '🦠 Crop Disease Scan Report Ready',
    desc: 'Early Blight detected on Tomato Leaf sample #2389. Recommended organic treatment: Copper fungicide or Neem oil solution.',
    time: '5 hours ago',
    read: false,
    path: '/disease-result'
  },
  {
    id: 3,
    type: 'weather',
    title: '🌧️ Heavy Rainfall Advisory',
    desc: 'Moderate to heavy rain expected in your district within 48 hours. Avoid spraying fertilizer or harvesting until skies clear.',
    time: '1 day ago',
    read: true,
    path: '/crop-calendar'
  },
  {
    id: 4,
    type: 'booking',
    title: '🚜 Tractor Booking Confirmed',
    desc: 'Mahindra Arjun 605 tractor rental is approved for June 18. Host contact info is available in booking history.',
    time: '2 days ago',
    read: true,
    path: '/equipment/history'
  }
]

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  useEffect(() => {
    async function loadNotifications() {
      try {
        const uid = user?.id || 1
        const res = await fetch(`${API_BASE}/notifications?user_id=${uid}`)
        const data = await res.json()
        if (data.success && data.notifications && data.notifications.length > 0) {
          const formatted = data.notifications.map(n => ({
            id: n.id,
            type: n.category,
            title: n.title,
            desc: n.message,
            time: 'Just now',
            read: n.severity === 'info' || n.severity === 'read',
            path: n.category === 'market' ? '/market-prices' : (n.category === 'pest' ? '/disease-result' : '/crop-calendar')
          }))
          setNotifications(formatted)
        } else {
          setNotifications(INITIAL_NOTIFICATIONS)
        }
      } catch (err) {
        console.warn("Failed to fetch notifications from backend, using default list", err)
        setNotifications(INITIAL_NOTIFICATIONS)
      }
    }
    loadNotifications()
  }, [user])

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const getIcon = (type) => {
    switch(type) {
      case 'market': return <TrendingUp size={18} color="var(--color-info)" />
      case 'disease': return <Bug size={18} color="var(--color-danger)" />
      case 'weather': return <CloudRain size={18} color="var(--color-warning)" />
      case 'booking': return <CheckCircle size={18} color="var(--color-primary-dark)" />
      default: return <Bell size={18} color="var(--text-muted)" />
    }
  }

  const getIconBg = (type) => {
    switch(type) {
      case 'market': return 'rgba(59, 130, 246, 0.08)'
      case 'disease': return 'rgba(239, 68, 68, 0.08)'
      case 'weather': return 'rgba(245, 158, 11, 0.08)'
      case 'booking': return 'var(--color-primary-glow)'
      default: return 'var(--bg-dark)'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1>🔔 Alerts & Notifications</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay updated on Mandi rates, weather conditions, and diagnostic reports.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleMarkAllRead}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 6 }}>
        {['all', 'unread', 'market', 'disease', 'weather', 'booking'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              border: filter === t ? '1.5px solid var(--color-primary)' : '1px solid var(--border-default)',
              background: filter === t ? 'var(--color-primary-glow)' : 'var(--bg-card)',
              color: filter === t ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in stagger-1">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div 
              key={item.id} 
              className="card" 
              style={{
                display: 'flex',
                gap: 14,
                padding: 18,
                background: item.read ? 'var(--bg-card)' : 'var(--color-primary-glow)',
                border: item.read ? '1px solid var(--border-subtle)' : '1.5px solid var(--color-primary-light)',
                borderRadius: 16,
                position: 'relative'
              }}
            >
              {/* Notification Icon */}
              <div style={{
                background: getIconBg(item.type),
                borderRadius: 12,
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)'
              }}>
                {getIcon(item.type)}
              </div>

              {/* Text Area */}
              <div style={{ flex: 1, paddingRight: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {item.time}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
                  {item.desc}
                </p>
                
                {/* Custom CTA Action */}
                <a href={item.path} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-dark)', textDecoration: 'none' }}>
                  Take Action <ArrowRight size={14} />
                </a>
              </div>

              {/* Delete button */}
              <button 
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 18,
                  right: 18,
                }}
                className="delete-notif-btn"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        ) : (
          <div className="card text-center" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Bell size={38} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: 4 }}>No notifications found</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              We will notify you here when you have weather alerts, mandi rate changes, or rental updates.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

