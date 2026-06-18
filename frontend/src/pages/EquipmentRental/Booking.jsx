import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE } from '../../services/apiConfig'

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [equip, setEquip] = useState(null)
  const [days, setDays] = useState(1)

  useEffect(() => {
    async function fetchEquip() {
      try {
        const res = await fetch(`${API_BASE}/equipment`)
        const j = await res.json()
        if (j.success && Array.isArray(j.equipment)) {
          const found = j.equipment.find(e => String(e.id) === String(id))
          setEquip(found || null)
        }
      } catch (e) {
        console.warn('Could not fetch equipment', e)
      }
    }
    fetchEquip()
  }, [id])

  if (!equip) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2>Loading equipment details...</h2>
      </div>
    )
  }

  async function confirmBooking() {
    try {
      const hours = Math.max(1, days * 8)
      const payload = { user_id: 1, equipment_id: equip.id, hours, date: new Date().toISOString().split('T')[0] }
      const res = await fetch(`${API_BASE}/equipment/book`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await res.json()
      if (!res.ok || !j.success) throw new Error(j.message || 'Booking failed')
      alert('Booking confirmed: ' + j.message)
      navigate('/equipment/history')
    } catch (e) {
      alert('Booking failed: ' + (e.message || e))
    }
  }

  const ratePerHour = equip.rate_per_hour || 150
  const dailyRate = ratePerHour * 8

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>⚙️ Booking Confirmation</h1>
        <p style={{ color: 'var(--text-muted)' }}>Confirm your rental details and schedule the equipment delivery for your farm.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }} className="animate-fade-in stagger-1">
        {/* Left Side: Equipment Detail Card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 240, overflow: 'hidden', background: 'var(--bg-dark)' }}>
            <img 
              src={equip.image_url || equip.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600'} 
              alt={equip.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ padding: 24 }}>
            <span style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary-dark)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
              {equip.type || 'Farming Machinery'}
            </span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: 12, marginBottom: 8 }}>{equip.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              {equip.description || 'High quality equipment regularly serviced and operational.'}
            </p>
          </div>
        </div>

        {/* Right Side: Booking Form details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 20, color: 'var(--text-primary)' }}>Rental Parameters</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Rate per Hour
                </label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{ratePerHour} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ hour</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Daily Standard Rate (8 Hours)
                </label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{dailyRate} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ day</span>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <label htmlFor="duration-days" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Rental Duration (Days)
                </label>
                <input 
                  id="duration-days"
                  type="number" 
                  min={1} 
                  value={days} 
                  onChange={e => setDays(Math.max(1, Number(e.target.value)))} 
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: 8, 
                    border: '1px solid var(--border-default)', 
                    width: '100%', 
                    maxWidth: 160,
                    outline: 'none',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }} 
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Estimated Total</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>₹{(dailyRate * days).toLocaleString()}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-block btn-lg" 
              onClick={confirmBooking}
              id="confirm-booking-btn"
              style={{ width: '100%' }}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

