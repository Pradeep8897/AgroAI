import React, { useEffect, useState } from 'react'
import { API_BASE } from '../../services/apiConfig'
import { Loader2, UserCheck } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_BASE}/admin/stats`)
        const data = await res.json()
        if (data.success && data.recent_users) {
          setUsers(data.recent_users)
        } else {
          setError('Failed to fetch recent users.')
        }
      } catch (err) {
        setError('Failed to connect to Admin API.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
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
          USER MANAGEMENT
        </span>
        <h1>Registered Accounts</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review farmer and admin accounts logged in the database.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: 40 }} className="animate-fade-in">
          <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> Loading registered accounts...
        </div>
      ) : error ? (
        <div className="alert alert-error animate-fade-in" style={{ padding: 16 }}>{error}</div>
      ) : (
        <div className="card animate-fade-in stagger-1" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={styles.tableHeader}>
            <span style={{ fontWeight: 700 }}>Username</span>
            <span style={{ fontWeight: 700 }}>Role</span>
            <span style={{ fontWeight: 700 }}>Email</span>
            <span style={{ fontWeight: 700, textAlign: 'right' }}>Date Registered</span>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {users.map(user => {
              const formattedDate = user.created_at 
                ? new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                : 'N/A'
              
              const isAdmin = user.role === 'admin'
              return (
                <div key={user.email} style={styles.tableRow}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserCheck size={16} color="var(--color-primary-dark)" /> {user.username}
                  </span>
                  <span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      background: isAdmin ? '#fee2e2' : 'var(--color-primary-glow)',
                      color: isAdmin ? '#b91c1c' : 'var(--color-primary-dark)',
                      border: isAdmin ? '1px solid #fecaca' : '1px solid var(--border-subtle)'
                    }}>
                      {user.role}
                    </span>
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user.email}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'right' }}>{formattedDate}</span>
                </div>
              )
            })}
          </div>

          {users.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              No accounts found in database.
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
    gridTemplateColumns: '1.2fr 1fr 1.8fr 1.2fr',
    gap: 16,
    padding: '16px 20px',
    background: 'var(--bg-dark)',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1.8fr 1.2fr',
    gap: 16,
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    alignItems: 'center',
    fontSize: '0.9rem',
    background: 'var(--bg-surface)',
    transition: 'background 0.2s ease',
  },
}

