import React, { useEffect, useState } from 'react'
import { API_BASE } from '../../services/apiConfig'
import { Loader2, Sprout } from 'lucide-react'

export default function Crops() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCrops() {
      try {
        const res = await fetch(`${API_BASE}/crop/history?user_id=1`)
        const data = await res.json()
        if (data.success && data.history) {
          setCrops(data.history)
        } else {
          setError('Failed to fetch crops history.')
        }
      } catch (err) {
        setError('Failed to connect to Crop API.')
      } finally {
        setLoading(false)
      }
    }
    fetchCrops()
  }, [])

  return (
    <div>
      <div className="page-header animate-fade-in">
        <span style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--color-primary-glow)',
          border: '1px solid var(--border-default)',
          borderRadius: 999,
          padding: '6px 14px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-primary-dark)',
          marginBottom: 14,
        }}>
          CROP MANAGEMENT
        </span>
        <h1>Crop Tracking History</h1>
        <p style={{ color: 'var(--text-muted)' }}>View soil nutrient logs currently tracked on the platform.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: 40 }} className="animate-fade-in">
          <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> Loading tracked crops...
        </div>
      ) : error ? (
        <div className="alert alert-error animate-fade-in" style={{ padding: 16 }}>{error}</div>
      ) : (
        <div className="card animate-fade-in stagger-1" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={styles.tableHeader}>
            <span style={{ fontWeight: 700 }}>Crop Name</span>
            <span style={{ fontWeight: 700 }}>Soil NPK (mg/kg)</span>
            <span style={{ fontWeight: 700 }}>Soil pH</span>
            <span style={{ fontWeight: 700, textAlign: 'right' }}>Recorded Date</span>
          </div>
          
          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {crops.map((crop, idx) => {
              const formattedDate = crop.created_at 
                ? new Date(crop.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                : 'N/A'
              return (
                <div key={idx} style={styles.tableRow}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sprout size={16} /> {crop.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    N: <span style={{ color: 'var(--text-primary)' }}>{crop.N}</span> • 
                    P: <span style={{ color: 'var(--text-primary)' }}>{crop.P}</span> • 
                    K: <span style={{ color: 'var(--text-primary)' }}>{crop.K}</span>
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{crop.ph?.toFixed(1) || '—'}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'right' }}>{formattedDate}</span>
                </div>
              )
            })}
          </div>

          {crops.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              No crop tracking records found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.5fr 0.8fr 1fr',
    gap: 16,
    padding: '16px 20px',
    background: 'var(--bg-dark)',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.5fr 0.8fr 1fr',
    gap: 16,
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    alignItems: 'center',
    fontSize: '0.9rem',
    background: 'var(--bg-surface)',
    transition: 'background 0.2s ease',
  },
}

