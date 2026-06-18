import React, { useState, useEffect } from 'react'
import { TrendingUp, Loader2 } from 'lucide-react'
import { getMarketPrices } from '../../services/marketService'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'

export default function MarketPrices() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getMarketPrices(filter).then(d => {
      if (d.success) setPrices(d.prices)
      else setError('Failed to load prices.')
    }).catch(() => setError('Backend unavailable.')).finally(() => setLoading(false))
  }, [filter])

  const chartData = prices.slice(0, 6).map(p => ({
    name: p.crop_name,
    current: p.current_price,
    predicted: p.predicted_price
  }))

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>📊 Live Market Prices</h1>
        <p>Real-time crop rates from major Mandis across India with AI price forecasts.</p>
      </div>

      {/* Chart */}
      <div className="chart-container animate-fade-in stagger-1" style={{ marginBottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Current vs Predicted Prices (₹/quintal)</h3>
          <span className="badge badge-success">Live Data</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="current" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-subtle)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'var(--bg-modal)', border: '1px solid var(--border-default)', borderRadius: 12, color: 'var(--text-primary)' }} />
            <Area type="monotone" dataKey="current" stroke="#22c55e" strokeWidth={2.5} fill="url(#current)" name="Current ₹" />
            <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 2" fill="url(#predicted)" name="Predicted ₹" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}><span style={{ width: 18, height: 2, background: '#22c55e', display: 'inline-block', borderRadius: 1 }} /> Current Price</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}><span style={{ width: 18, height: 2, background: '#3b82f6', display: 'inline-block', borderRadius: 1 }} /> Predicted Price</span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }} className="animate-fade-in stagger-2">
        <input className="form-input" style={{ maxWidth: 280 }} placeholder="Filter by crop name..." id="market-filter-input"
          value={filter} onChange={e => setFilter(e.target.value)} />
        {filter && <button className="btn btn-ghost btn-sm" onClick={() => setFilter('')}>Clear</button>}
      </div>

      {/* Table */}
      <div className="table-wrapper animate-fade-in stagger-3">
        {loading ? (
          <div className="loading-center"><div className="spinner" /><span>Loading Mandi prices...</span></div>
        ) : error ? (
          <div className="alert alert-error" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table>
            <thead>
              <tr><th>Crop</th><th>Market</th><th>State</th><th>Current Price (₹/q)</th><th>Predicted (₹/q)</th><th>Change</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {prices.map((p, i) => {
                const change = ((p.predicted_price - p.current_price) / p.current_price * 100).toFixed(1)
                const bullish = p.predicted_price >= p.current_price
                return (
                  <tr key={i}>
                    <td><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.crop_name}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.market_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.state}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>₹{p.current_price?.toLocaleString()}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>₹{p.predicted_price?.toLocaleString()}</td>
                    <td style={{ color: bullish ? 'var(--color-primary-dark)' : 'var(--color-danger)', fontWeight: 600 }}>{bullish ? '+' : ''}{change}%</td>
                    <td><span className={bullish ? 'badge badge-success' : 'badge badge-danger'}>{bullish ? '↑ Bullish' : '↓ Bearish'}</span></td>
                  </tr>
                )
              })}
              {prices.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No prices found. Start the backend server.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
