import React, { useEffect, useState } from 'react'
import { useAuth } from '../../App'
import { API_BASE } from '../../services/apiConfig'

export default function Rentalhistory() {
  const [bookings, setBookings] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    async function fetchHistory() {
      try {
        const uid = user?.id || 1
        const res = await fetch(`${API_BASE}/equipment/history?user_id=${uid}`)
        const j = await res.json()
        if (j.success) setBookings(j.bookings || [])
        else {
          const raw = localStorage.getItem('rental_bookings')
          setBookings(raw ? JSON.parse(raw) : [])
        }
      } catch (e) {
        const raw = localStorage.getItem('rental_bookings')
        setBookings(raw ? JSON.parse(raw) : [])
      }
    }
    fetchHistory()
  }, [user])

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>📜 Rental History</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review your past and current agricultural equipment rental details.</p>
      </div>

      {bookings.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-card)', border: '1.5px dashed var(--border-subtle)', borderRadius: 16 }} className="animate-fade-in stagger-1">
          <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.95rem' }}>No rental bookings yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in stagger-1">
          {bookings.map(b => {
            const formattedDate = b.created_at 
              ? new Date(b.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
              : (b.date ? b.date : 'Recent Date')
            const computedDays = b.hours ? Math.round(b.hours / 8) : (b.days || 1)
            
            return (
              <div key={b.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                    🚜
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                      {b.equipment_name || 'Machinery'}
                    </h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      Rented for {computedDays} {computedDays === 1 ? 'day' : 'days'} • {formattedDate}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right', minWidth: 100 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Cost</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.1rem', marginTop: 2 }}>
                      ₹{b.total_cost || (1200 * computedDays)}
                    </div>
                  </div>

                  <div style={{ background: '#ecfdf5', color: '#047857', padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, border: '1px solid #a7f3d0' }}>
                    Active / Confirmed
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

