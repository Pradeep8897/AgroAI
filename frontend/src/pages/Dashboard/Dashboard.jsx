import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../App'
import { getMarketPrices } from '../../services/marketService'
import {
  Sprout, Bug, TrendingUp, ShoppingBag, Tractor, Calculator,
  ArrowRight, Cloud, Droplets, Wind, Thermometer, Bell, CheckCircle, AlertTriangle, Info
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const QUICK_ACTIONS = [
  { title: 'Crop Recommendation', icon: Sprout, path: '/crop-recommendation', color: '#22c55e', desc: 'Get AI crop advice' },
  { title: 'Disease Detection', icon: Bug, path: '/disease-detect', color: '#ef4444', desc: 'Upload leaf photo' },
  { title: 'Market Prices', icon: TrendingUp, path: '/market-prices', color: '#3b82f6', desc: 'Live Mandi rates' },
  { title: 'Marketplace', icon: ShoppingBag, path: '/marketplace', color: '#f59e0b', desc: 'Buy seeds & supplies' },
  { title: 'Rent Equipment', icon: Tractor, path: '/equipment', color: '#8b5cf6', desc: 'Tractors & harvesters' },
  { title: 'Profit Optimizer', icon: Calculator, path: '/cost-calculator', color: '#10b981', desc: 'Calculate ROI' },
]

const MOCK_CHART_DATA = [
  { month: 'Jan', price: 1650 }, { month: 'Feb', price: 1720 },
  { month: 'Mar', price: 1580 }, { month: 'Apr', price: 1800 },
  { month: 'May', price: 1950 }, { month: 'Jun', price: 1850 },
]

const ALERTS = [
  { type: 'critical', icon: AlertTriangle, color: '#ef4444', title: 'Heatwave Alert', msg: 'Temperatures >42°C expected. Irrigate early morning.' },
  { type: 'warning', icon: Bell, color: '#f59e0b', title: 'Aphid Advisory', msg: 'Aphid activity increasing in potato regions. Apply neem oil.' },
  { type: 'info', icon: Info, color: '#3b82f6', title: 'Rice Price Spike', msg: 'Basmati rates up 8% at Karnal Mandi. Good time to sell.' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMarketPrices().then(d => {
      if (d.success) setPrices(d.prices.slice(0, 4))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Welcome Banner Card */}
      <div style={styles.welcomeBanner} className="animate-fade-in">
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.9, fontWeight: 700 }}>
            Premium Farm Portal
          </span>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800, margin: '4px 0 8px 0', border: 'none' }}>
            {greeting}, {user?.username || 'Farmer'} 👋
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
            🌱 AI recommends prepping your fields for sowing. Live mandi trends show a bullish rise.
          </p>
        </div>
        <div style={styles.bannerIconContainer}>
          <Sprout size={48} color="#ffffff" style={{ opacity: 0.95 }} />
        </div>
      </div>

      {/* Modern Dashboard Cards */}
      <div className="grid-4 animate-fade-in stagger-1" style={{ marginBottom: 24 }}>
        {/* Live Weather Card */}
        <div className="card" style={styles.dashboardCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.cardLabel}>Live Weather</div>
              <div style={styles.cardValue}>38°C</div>
              <div style={styles.cardSub}>Hum: 68% • Wind: 12km/h</div>
            </div>
            <div style={{ ...styles.cardIconBox, background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
              <Cloud size={20} />
            </div>
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="card" style={styles.dashboardCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.cardLabel}>AI Recommendation</div>
              <div style={styles.cardValue}>Wheat</div>
              <div style={styles.cardSub}>82% Match • Rabi Season</div>
            </div>
            <div style={{ ...styles.cardIconBox, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              <Sprout size={20} />
            </div>
          </div>
        </div>

        {/* Market Price Card */}
        <div className="card" style={styles.dashboardCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.cardLabel}>Market Price Alert</div>
              <div style={styles.cardValue}>+8% Rise</div>
              <div style={styles.cardSub}>Tomato rates: ₹1,950/q</div>
            </div>
            <div style={{ ...styles.cardIconBox, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* Profit Summary Card */}
        <div className="card" style={styles.dashboardCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.cardLabel}>Profit Optimizer</div>
              <div style={styles.cardValue}>₹45.2K</div>
              <div style={styles.cardSub}>ROI: +12% this month</div>
            </div>
            <div style={{ ...styles.cardIconBox, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Calculator size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.mainGrid} className="animate-fade-in stagger-2">
        {/* Price Chart */}
        <div className="chart-container" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Tomato Price Trend (₹/quintal)</h3>
            <span className="badge badge-success">Live Mandi</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-modal)', border: '1px solid var(--border-default)', borderRadius: 12, color: 'var(--text-primary)' }} />
              <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2.5} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Panel */}
        <div style={styles.alertsContainer}>
          <h3 style={{ fontSize: '1rem', marginBottom: 14, color: 'var(--text-primary)', fontWeight: 700 }}>🔔 Recent Advisories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ALERTS.map(alert => (
              <div key={alert.title} style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${alert.color}20`,
                borderLeft: `4px solid ${alert.color}`,
                borderRadius: 12,
                padding: '12px 14px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <alert.icon size={14} color={alert.color} />
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{alert.title}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: 14, color: 'var(--text-primary)', fontWeight: 700 }}>⚡ Quick Tools</h3>
      <div className="grid-3 animate-fade-in stagger-3" style={{ marginBottom: 24 }}>
        {QUICK_ACTIONS.map(action => (
          <Link key={action.path} to={action.path} style={{ textDecoration: 'none' }} className="dashboard-action-link">
            <div style={{
              ...styles.actionCard,
              '--action-color': action.color,
            }}>
              <div style={{ ...styles.actionIcon, background: `${action.color}12`, border: `1px solid ${action.color}20` }}>
                <action.icon size={20} color={action.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>{action.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{action.desc}</div>
              </div>
              <ArrowRight size={16} color="var(--text-dim)" />
            </div>
          </Link>
        ))}
      </div>

      {/* Market Prices Table */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: 14, color: 'var(--text-primary)', fontWeight: 700 }}>📊 Live Mandi Prices</h3>
      <div className="table-wrapper animate-fade-in stagger-4">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Market</th>
                <th>State</th>
                <th>Price (₹/q)</th>
                <th>Forecast</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {prices.map(p => (
                <tr key={p.id}>
                  <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.crop_name}</span></td>
                  <td>{p.market_name}</td>
                  <td>{p.state}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>₹{p.current_price?.toLocaleString()}</td>
                  <td>₹{p.predicted_price?.toLocaleString()}</td>
                  <td>
                    <span className={p.predicted_price > p.current_price ? 'badge badge-success' : 'badge badge-danger'}>
                      {p.predicted_price > p.current_price ? '↑ Bullish' : '↓ Bearish'}
                    </span>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>Start the backend server to load live market data.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Link to="/market-prices" className="btn btn-secondary btn-sm">View All Prices →</Link>
      </div>
    </div>
  )
}

const styles = {
  welcomeBanner: {
    background: 'linear-gradient(135deg, #22C55E 0%, #15803d 100%)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    boxShadow: '0 6px 20px rgba(22, 197, 94, 0.15)',
    color: '#ffffff',
  },
  bannerIconContainer: {
    width: 64,
    height: 64,
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardCard: {
    padding: '16px',
    boxShadow: 'var(--shadow-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    background: 'var(--bg-card)',
  },
  cardLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  cardSub: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: 4,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.6fr',
    gap: 20,
    marginBottom: 24,
  },
  alertsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 16,
    padding: '14px 16px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-card)',
  },
  actionIcon: {
    width: 44, height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}
