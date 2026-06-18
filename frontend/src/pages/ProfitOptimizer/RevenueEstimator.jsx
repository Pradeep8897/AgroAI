import React from 'react'
import { ArrowUpRight, CalendarDays, PieChart, Layers } from 'lucide-react'

const PROJECTIONS = [
  { crop: 'Wheat', period: 'Next quarter', revenue: '₹1,45,000', growth: '+12%' },
  { crop: 'Sugarcane', period: 'Next quarter', revenue: '₹1,80,000', growth: '+18%' },
  { crop: 'Chili', period: 'Next quarter', revenue: '₹95,000', growth: '+22%' },
]

export default function RevenueEstimator() {
  return (
    <div>
      <div style={styles.header} className="animate-fade-in">
        <div>
          <div style={styles.badge}>REVENUE ESTIMATOR</div>
          <h1 style={{ marginTop: 8 }}>Forecast farm revenue quickly</h1>
          <p style={{ color: 'var(--text-muted)' }}>Evaluate expected returns for your crop plan and adjust planting decisions before the season begins.</p>
        </div>
      </div>

      <div style={styles.cards}>
        <div className="card animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div style={styles.cardMetric}><ArrowUpRight size={18} color="var(--color-primary)" /></div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Projected revenue</h3>
          <p style={styles.cardValue}>₹2,75,000</p>
        </div>
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div style={styles.cardMetric}><CalendarDays size={18} color="var(--color-primary)" /></div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Best season</h3>
          <p style={styles.cardValue}>Rabi 2026</p>
        </div>
        <div className="card animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div style={styles.cardMetric}><PieChart size={18} color="var(--color-primary)" /></div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Revenue mix</h3>
          <p style={styles.cardValue}>Tomato 42% / Rice 34%</p>
        </div>
      </div>

      <div className="card" style={styles.tableCard}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>Revenue projections</h2>
        <div style={styles.projectionList}>
          {PROJECTIONS.map(item => (
            <div key={item.crop} style={styles.projectionRow}>
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.crop}</strong>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>{item.period}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.projectionValue}>{item.revenue}</div>
                <div style={{ color: item.growth.startsWith('+') ? 'var(--color-primary-dark)' : 'var(--color-warning)', fontWeight: 700, fontSize: '0.85rem', marginTop: 2 }}>{item.growth}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: {
    marginBottom: 24,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--color-primary-glow)',
    border: '1px solid var(--border-default)',
    borderRadius: 999,
    padding: '6px 14px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--color-primary-dark)',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 18,
    marginBottom: 24,
  },
  cardMetric: {
    width: 46,
    height: 46,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    background: 'var(--color-primary-glow)',
    marginBottom: 14,
  },
  cardValue: {
    fontSize: '1.9rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  tableCard: {
    padding: 24,
    borderRadius: 16,
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-card)',
  },
  projectionList: {
    display: 'grid',
    gap: 14,
    marginTop: 18,
  },
  projectionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    background: 'var(--bg-dark)',
    border: '1px solid var(--border-subtle)',
  },
  projectionValue: {
    fontWeight: 800,
    fontSize: '1.05rem',
    color: 'var(--text-primary)',
  },
}
