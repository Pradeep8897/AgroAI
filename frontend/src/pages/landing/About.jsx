import React from 'react'
import { Leaf, Globe2, HeartPulse, ShieldCheck } from 'lucide-react'

const VALUES = [
  { icon: Globe2, title: 'Inclusive', detail: 'Designed for small and medium farmers with easy mobile access.' },
  { icon: HeartPulse, title: 'Reliable', detail: 'Fast insights, curated by agronomists and AI models.' },
  { icon: ShieldCheck, title: 'Secure', detail: 'Your farm data stays private and under your control.' },
]

export default function About() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.badge}>ABOUT AGROAI</div>
          <h1>Building smarter farms with AI and trusted agronomy.</h1>
          <p>AgroAI helps farmers plan crops, detect disease, buy supplies, rent equipment, and sell at the best price — all from one secure dashboard.</p>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>50K+</div>
            <div>Farmers empowered</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>98%</div>
            <div>Disease accuracy</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>500+</div>
            <div>Crop recommendations</div>
          </div>
        </div>
      </div>

      <section style={styles.features}>
        {VALUES.map((item, idx) => (
          <div key={item.title} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div style={styles.iconCircle}><item.icon size={22} color="#22c55e" /></div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
        ))}
      </section>

      <section style={styles.mission}>
        <div style={styles.missionBox}>
          <h2>Our mission</h2>
          <p>To give every farmer access to smart agriculture tools, market insights, and support that helps them grow more sustainably and profitably.</p>
        </div>
        <div style={styles.missionBox}>
          <h2>Our vision</h2>
          <p>To transform agriculture across India by making AI-powered decisions simple, practical, and affordable.</p>
        </div>
      </section>
    </div>
  )
}

const styles = {
  page: {
    padding: 32,
    minHeight: '100vh',
    background: 'rgba(255,255,255,0.02)',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(165, 197, 34, 0.16)',
    borderRadius: 999,
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#a7f3d0',
    marginBottom: 18,
  },
  statsGrid: {
    display: 'grid',
    gap: 14,
  },
  statCard: {
    background: 'rgba(15, 35, 22, 0.85)',
    border: '1px solid rgba(34,197,94,0.14)',
    borderRadius: 18,
    padding: 24,
  },
  statValue: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#f0fdf4',
    marginBottom: 8,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 18,
    marginBottom: 32,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: 'rgba(34,197,94,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mission: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 18,
  },
  missionBox: {
    background: 'rgba(15, 35, 22, 0.78)',
    border: '1px solid rgba(34,197,94,0.12)',
    borderRadius: 18,
    padding: 28,
  },
}
