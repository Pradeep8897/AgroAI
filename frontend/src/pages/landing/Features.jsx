import React from 'react'
import { Leaf, Bug, TrendingUp, ShoppingBag, Tractor, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: Leaf, title: 'Smart Crop Advice', text: 'AI suggests the best crop and planting plan for your soil, season, and budget.' },
  { icon: Bug, title: 'Disease Detection', text: 'Upload leaf images to diagnose infections and get treatment guides.' },
  { icon: TrendingUp, title: 'Market Forecasts', text: 'Track mandi prices, demand predictions, and sell at the right time.' },
  { icon: ShoppingBag, title: 'Farm Marketplace', text: 'Buy fertilizers, seeds, tools, and agro supplies from verified sellers.' },
  { icon: Tractor, title: 'Equipment Rental', text: 'Rent tractors, harvesters, and irrigation equipment anytime.' },
  { icon: MessageCircle, title: 'AI Assistant', text: 'Ask questions in natural language and get instant farming advice.' },
]

export default function Features() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>FEATURES</div>
          <h1>All the tools a modern farmer needs</h1>
          <p>AgroAI brings precision agriculture, market intelligence, and farm operations into one smart dashboard.</p>
        </div>
        <Link to="/register" className="btn btn-primary">Create Free Account</Link>
      </div>

      <div style={styles.grid}>
        {FEATURES.map((item, idx) => (
          <div key={item.title} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div style={styles.iconBox}>
              <item.icon size={22} color="#22c55e" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <section style={styles.ctaSection}>
        <h2>Ready to grow smarter?</h2>
        <p>Start using AgroAI to track crop health, optimize inputs, and discover the best mandi prices.</p>
        <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
      </section>
    </div>
  )
}

const styles = {
  page: {
    padding: '32px',
    minHeight: '100vh',
    background: 'rgba(255,255,255,0.02)',
    color: '#f8fafc',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 999,
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#a7f3d0',
    marginBottom: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 18,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: 'rgba(34,197,94,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  ctaSection: {
    marginTop: 48,
    padding: 28,
    borderRadius: 20,
    background: 'rgba(15, 35, 22, 0.85)',
    border: '1px solid rgba(34,197,94,0.16)',
    textAlign: 'center',
  },
}
