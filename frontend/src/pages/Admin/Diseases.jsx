import React, { useEffect, useState } from 'react'
import { API_BASE } from '../../services/apiConfig'
import { Loader2, AlertTriangle } from 'lucide-react'

export default function Diseases() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(`${API_BASE}/disease/reports?user_id=1`)
        const data = await res.json()
        if (data.success && data.reports) {
          setReports(data.reports)
        } else {
          setError('Failed to fetch disease reports.')
        }
      } catch (err) {
        setError('Failed to connect to Disease API.')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
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
          DISEASE ADVISORIES
        </span>
        <h1>Crop Health Scan Logs</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review diagnostic leaf scans processed on the platform.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: 40 }} className="animate-fade-in">
          <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> Loading scan logs...
        </div>
      ) : error ? (
        <div className="alert alert-error animate-fade-in" style={{ padding: 16 }}>{error}</div>
      ) : (
        <div className="card animate-fade-in stagger-1" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={styles.tableHeader}>
            <span style={{ fontWeight: 700 }}>Crop Affected</span>
            <span style={{ fontWeight: 700 }}>Disease Detected</span>
            <span style={{ fontWeight: 700 }}>Severity</span>
            <span style={{ fontWeight: 700, textAlign: 'right' }}>Scan Date</span>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {reports.map((report, idx) => {
              const formattedDate = report.created_at 
                ? new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                : 'N/A'
              
              const isHigh = report.severity === 'High' || report.severity === 'Severe'
              return (
                <div key={idx} style={styles.tableRow}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{report.crop_name}</span>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={15} /> {report.disease_name}
                  </span>
                  <span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: isHigh ? '#fef2f2' : '#ecfdf5',
                      color: isHigh ? '#b91c1c' : '#047857',
                      border: isHigh ? '1px solid #fecaca' : '1px solid #a7f3d0'
                    }}>
                      {report.severity}
                    </span>
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'right' }}>{formattedDate}</span>
                </div>
              )
            })}
          </div>

          {reports.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              No disease scan logs found.
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

