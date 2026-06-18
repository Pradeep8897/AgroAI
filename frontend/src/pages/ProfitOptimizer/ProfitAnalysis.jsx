import React from 'react'
import { TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react'

const METRICS = [
  { icon: TrendingUp, title: 'Profit Growth', value: '+24%', detail: 'Compared to last season' },
  { icon: DollarSign, title: 'Average margin', value: '₹12,450', detail: 'Per crop plan' },
  { icon: BarChart3, title: 'Crop ROI', value: '39%', detail: 'Based on current inputs' },
  { icon: PieChart, title: 'Expense share', value: '62%', detail: 'Fertilizer and labor costs' },
]

export default function ProfitAnalysis() {
  return (
    <div>
      <div style={styles.header} className="animate-fade-in">
        <div>
          <div style={styles.badge}>PROFIT ANALYSIS</div>
          <h1 style={{ marginTop: 8 }}>Understand your farm profitability</h1>
          <p style={{ color: 'var(--text-muted)' }}>See how crop selection, input cost, and market prices affect your margins.</p>
        </div>
      </div>

      <div style={styles.grid}>
        {METRICS.map((metric, idx) => (
          <div key={metric.title} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div style={styles.metricIcon}><metric.icon size={20} color="var(--color-primary-dark)" /></div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{metric.title}</h3>
            <p style={{ fontSize: '1.8rem', margin: '14px 0', fontWeight: 800, color: 'var(--text-primary)' }}>{metric.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{metric.detail}</p>
          </div>
        ))}
      </div>

      <div style={styles.reportCard} className="card">
        <h2 style={{ color: 'var(--text-primary)' }}>Profit breakdown</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 18, fontSize: '0.88rem' }}>This summary shows your forecasted earnings across crops and input categories.</p>
        <div style={styles.table}> 
          <div style={styles.tableRowHeader}>
            <span>Crop</span>
            <span>Revenue</span>
            <span>Cost</span>
            <span>Margin</span>
          </div>
          {[
            { crop: 'Tomato', revenue: '₹1,82,000', cost: '₹80,500', margin: '56%' },
            { crop: 'Rice', revenue: '₹2,05,000', cost: '₹96,200', margin: '53%' },
            { crop: 'Potato', revenue: '₹1,40,000', cost: '₹55,400', margin: '60%' },
          ].map(row => (
            <div key={row.crop} style={styles.tableRow}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.crop}</span>
              <span style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>{row.revenue}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{row.cost}</span>
              <span style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>{row.margin}</span>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 18,
    marginBottom: 24,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: 'var(--color-primary-glow)',
    display: 'grid',
    placeItems: 'center',
    marginBottom: 16,
  },
  reportCard: {
    padding: 24,
    borderRadius: 16,
    boxShadow: 'var(--shadow-card)',
  },
  table: {
    display: 'grid',
    gap: 10,
  },
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 12,
    background: 'var(--bg-dark)',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.9rem',
    boxShadow: 'var(--shadow-sm)',
  },
}
