import React, { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, LineChart, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { getMarketPrices } from '../../services/marketService'

export default function Trends() {
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTrends() {
      try {
        const data = await getMarketPrices()
        if (data.success && data.prices) {
          const generatedTrends = data.prices.map(p => {
            const diff = p.predicted_price - p.current_price
            const changePercent = ((diff / p.current_price) * 100).toFixed(1)
            const isUp = diff >= 0
            
            return {
              title: `${p.crop_name} - ${p.market_name}`,
              subtitle: isUp 
                ? `Forecasted price: ₹${p.predicted_price}/q (+${changePercent}% bullish spike). Recommendation: Hold stock for better returns.`
                : `Forecasted price: ₹${p.predicted_price}/q (${changePercent}% bearish decline). Recommendation: Sell current stock in next 48 hours.`,
              isUp,
              current: p.current_price,
              predicted: p.predicted_price,
              change: changePercent
            }
          })
          setTrends(generatedTrends)
        }
      } catch (err) {
        setError('Failed to fetch market trends from backend server.')
      } finally {
        setLoading(false)
      }
    }
    loadTrends()
  }, [])

  return (
    <div>
      <div style={styles.header} className="animate-fade-in">
        <div>
          <div style={styles.badge}>MARKET TRENDS</div>
          <h1 style={{ marginTop: 8 }}>Dynamic Agricultural Market Trends</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time AI price warnings, demand signals, and crop-specific mandi advice.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading market trends...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div style={styles.grid}>
          {trends.map((item, idx) => (
            <div key={idx} className="card animate-fade-in" style={{ 
              animationDelay: `${idx * 0.08}s`,
              border: item.isUp ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.25)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{
                  ...styles.iconCircle,
                  background: item.isUp ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)'
                }}>
                  {item.isUp 
                    ? <ArrowUpRight size={20} color="#16a34a" /> 
                    : <ArrowDownRight size={20} color="#ef4444" />
                  }
                </div>
                <span className={item.isUp ? 'badge badge-success' : 'badge badge-danger'}>
                  {item.isUp ? '↑ Bullish' : '↓ Bearish'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.85rem', lineHeight: 1.5 }}>{item.subtitle}</p>
              
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current: ₹{item.current}/q</span>
                <span style={{ fontWeight: 700, color: item.isUp ? 'var(--color-primary-dark)' : 'var(--color-danger)' }}>
                  {item.isUp ? '+' : ''}{item.change}%
                </span>
              </div>
            </div>
          ))}
          {trends.length === 0 && (
            <div style={{ color: 'var(--text-muted)' }}>No mandi records found to compile trends.</div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  header: { marginBottom: 24 },
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 18,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
  },
}
