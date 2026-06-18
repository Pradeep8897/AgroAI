import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Sprout, Bug, TrendingUp, ShoppingBag, Tractor, MessageCircle, Star, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'

const FEATURES = [
  { icon: Sprout, title: 'Smart Crop AI', desc: 'Get personalized crop recommendations based on soil NPK, pH, temperature, humidity, and rainfall data.', color: '#22c55e' },
  { icon: Bug, title: 'Disease Detection', desc: 'Upload a leaf photo and our AI identifies diseases in seconds with chemical and organic treatment plans.', color: '#ef4444' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Track live Mandi prices across India and get AI-powered demand forecasts for your crops.', color: '#3b82f6' },
  { icon: ShoppingBag, title: 'Farm Marketplace', desc: 'Buy certified seeds, fertilizers, and organic pesticides directly. Delivery to your doorstep.', color: '#f59e0b' },
  { icon: Tractor, title: 'Equipment Rental', desc: 'Rent tractors, harvesters, and irrigation kits by the hour. Affordable and on-demand.', color: '#8b5cf6' },
  { icon: MessageCircle, title: 'AI Farm Assistant', desc: 'Ask farming questions in natural language anytime. Voice support included.', color: '#10b981' },
]

const STATS = [
  { value: '50K+', label: 'Farmers Helped' },
  { value: '98%', label: 'Detection Accuracy' },
  { value: '500+', label: 'Crop Varieties' },
  { value: '24/7', label: 'AI Support' },
]

const TESTIMONIALS = [
  { name: 'Ramesh Patel', role: 'Wheat Farmer, MP', text: 'The crop recommendation tool helped me switch from cotton to wheat this season. Profit increased by 40%!', rating: 5 },
  { name: 'Sunita Devi', role: 'Vegetable Grower, UP', text: 'I uploaded a sick tomato leaf and instantly got the disease name and treatment recipe. Saved my entire harvest!', rating: 5 },
  { name: 'Mohan Singh', role: 'Rice Farmer, Punjab', text: 'Market price alerts notify me when to sell. I earned 18% more than my neighbors this season.', rating: 5 },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        {/* Animated BG */}
        <div style={styles.heroBg} />
        <div style={styles.heroBg2} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <Leaf size={13} /> Powered by Artificial Intelligence
          </div>
          <h1 style={styles.heroTitle}>
            Smarter Farming<br />
            <span className="shimmer-text">with AI at Your Side</span>
          </h1>
          <p style={styles.heroDesc}>
            AgroAI combines machine learning, real-time market data, and precision agronomy to help Indian farmers grow more, earn more, and lose less.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta-register">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/features" className="btn btn-secondary btn-lg" id="hero-cta-features">
              Explore Features
            </Link>
          </div>

          {/* Trust badges */}
          <div style={styles.trustRow}>
            {['No credit card required', 'Works on any phone', 'Available in Hindi & English'].map(txt => (
              <span key={txt} style={styles.trustBadge}>
                <CheckCircle size={13} color="#22c55e" /> {txt}
              </span>
            ))}
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div style={styles.heroCards}>
          <div style={{ ...styles.floatCard, top: '10%', right: '5%', animationDelay: '0s' }}>
            <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 800 }}>🌾 Rice</div>
            <div style={{ color: '#86efac', fontSize: '0.75rem' }}>Best Match: 96.4%</div>
          </div>
          <div style={{ ...styles.floatCard, top: '40%', right: '-2%', animationDelay: '0.5s' }}>
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>🦠 Early Blight</div>
            <div style={{ color: '#86efac', fontSize: '0.7rem' }}>Detected • Treatment Ready</div>
          </div>
          <div style={{ ...styles.floatCard, top: '70%', right: '8%', animationDelay: '1s' }}>
            <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>📈 Tomato +8%</div>
            <div style={{ color: '#86efac', fontSize: '0.7rem' }}>Azadpur Mandi ₹1,850/q</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {STATS.map(stat => (
            <div key={stat.label} style={styles.statItem}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section} id="features">
        <div style={styles.sectionLabel}>WHAT WE OFFER</div>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Everything a Farmer Needs</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          From soil to sale — AgroAI covers every step of your farming journey with intelligent tools.
        </p>
        <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {FEATURES.map((f, idx) => (
            <div key={f.title} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div style={{ ...styles.featureIcon, background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ ...styles.section, background: 'rgba(10, 25, 15, 0.5)' }}>
        <div style={styles.sectionLabel}>SUCCESS STORIES</div>
        <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Trusted by Farmers Across India</h2>
        <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {TESTIMONIALS.map((t, idx) => (
            <div key={t.name} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', fontStyle: 'italic', marginBottom: 16 }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, color: '#f0fdf4', fontSize: '0.875rem' }}>{t.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ ...styles.section, textAlign: 'center' }}>
        <div style={styles.ctaBox}>
          <div style={styles.heroBadge}>🌱 Start Today — It's Free</div>
          <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Ready to Transform Your Farm?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Join thousands of farmers using AI to make smarter decisions every day.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-bottom-register">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Leaf size={16} color="#22c55e" />
          <span style={{ fontWeight: 700, color: '#f0fdf4' }}>AgroAI</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © 2026 AgroAI. All rights reserved. Built with ❤️ for Indian farmers.
        </p>
      </footer>
    </div>
  )
}

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 80,
    background: 'var(--gradient-hero)',
  },
  heroBg: {
    position: 'absolute',
    top: '-20%', left: '-10%',
    width: '60%', height: '80%',
    background: 'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  heroBg2: {
    position: 'absolute',
    bottom: '-10%', right: '-10%',
    width: '50%', height: '60%',
    background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: 700,
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: 100,
    padding: '5px 14px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#22c55e',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: 20,
    letterSpacing: '-0.02em',
  },
  heroDesc: {
    fontSize: '1.05rem',
    color: 'var(--text-secondary)',
    marginBottom: 32,
    lineHeight: 1.7,
  },
  trustRow: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  heroCards: {
    position: 'absolute',
    right: '5%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 220,
    height: 400,
    display: 'none', // Hidden on mobile, show on large screens via media query
  },
  floatCard: {
    position: 'absolute',
    background: 'rgba(10, 25, 15, 0.9)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    borderRadius: 12,
    padding: '10px 14px',
    backdropFilter: 'blur(12px)',
    animation: 'fadeIn 1s ease both',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    minWidth: 170,
  },
  statsSection: {
    borderTop: '1px solid rgba(34, 197, 94, 0.1)',
    borderBottom: '1px solid rgba(34, 197, 94, 0.1)',
    background: 'rgba(10, 25, 15, 0.6)',
    padding: '40px 24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 32,
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center',
  },
  statItem: {},
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#22c55e',
    lineHeight: 1,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  section: {
    padding: '80px 24px',
  },
  sectionLabel: {
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#22c55e',
    letterSpacing: '0.12em',
    marginBottom: 14,
  },
  featureIcon: {
    width: 48, height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  ctaBox: {
    background: 'linear-gradient(135deg, rgba(15, 35, 22, 0.9), rgba(10, 25, 15, 0.8))',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    borderRadius: 24,
    padding: '60px 40px',
    maxWidth: 640,
    margin: '0 auto',
    boxShadow: '0 0 48px rgba(34, 197, 94, 0.1)',
  },
  footer: {
    borderTop: '1px solid rgba(34, 197, 94, 0.1)',
    padding: '28px 24px',
    textAlign: 'center',
    background: 'rgba(3, 13, 6, 0.8)',
  },
}
