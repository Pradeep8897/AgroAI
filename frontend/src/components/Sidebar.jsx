import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, Bug, TrendingUp, ShoppingBag,
  Tractor, MessageCircle, Calculator, User, Settings,
  ChevronDown, ChevronRight, Leaf
} from 'lucide-react'
import { useAuth } from '../App'

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
    ]
  },
  {
    title: 'Smart Farming',
    icon: Sprout,
    items: [
      { label: 'Crop Recommendation', path: '/crop-recommendation' }
    ]
  },
  {
    title: 'Disease Detection',
    icon: Bug,
    items: [
      { label: 'Upload Leaf Image', path: '/disease-detect' },
      { label: 'Disease History', path: '/disease-result' },
      { label: 'Treatment Library', path: '/treatment' },
    ]
  },
  {
    title: 'Market Intelligence',
    icon: TrendingUp,
    items: [
      { label: 'Market Prices', path: '/market-prices' },
      { label: 'Demand Prediction', path: '/demand-prediction' },
      { label: 'Nearby Mandis', path: '/nearby-mandi' },
    ]
  },
  {
    title: 'Marketplace',
    icon: ShoppingBag,
    items: [
      { label: 'Browse Products', path: '/marketplace' }
    ]
  },
  {
    title: 'Equipment Rental',
    icon: Tractor,
    items: [
      { label: 'Browse Equipment', path: '/equipment' },
      { label: 'Booking History', path: '/equipment/history' },
    ]
  },
  {
    title: 'AI Assistant',
    icon: MessageCircle,
    items: [
      { label: 'Chat Assistant', path: '/assistant' },
      { label: 'Voice Assistant', path: '/voice-assistant' },
    ]
  },
  {
    title: 'Profit Optimizer',
    icon: Calculator,
    items: [
      { label: 'Cost Calculator', path: '/cost-calculator' },
      { label: 'Profit Analysis', path: '/profit-analysis' },
      { label: 'Revenue Estimator', path: '/revenue-estimator' },
    ]
  },
]

function NavSection({ section, isOpen, onToggle, location }) {
  const hasActive = section.items.some(i => location.pathname === i.path)

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Section Header */}
      <button
        style={{
          ...styles.sectionHeader,
          color: hasActive ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
          background: hasActive ? 'var(--color-primary-glow)' : 'transparent',
        }}
        onClick={onToggle}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {section.icon && <section.icon size={14} />}
          {section.title}
        </span>
        {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>

      {/* Items */}
      {isOpen && (
        <div style={{ paddingLeft: 8 }}>
          {section.items.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  background: active ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                  color: active ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
                  borderLeft: active ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                  fontWeight: active ? '600' : '400',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  // Initialize with sections expanded if they have an active child
  const [openSections, setOpenSections] = useState(() => {
    const init = {}
    NAV_SECTIONS.forEach((s, i) => {
      init[i] = s.items.some(item => location.pathname === item.path) || i === 0
    })
    return init
  })

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <aside style={styles.sidebar} id="app-sidebar">
      {/* Logo / Brand header */}
      <div style={styles.sidebarHeader}>
        <div style={styles.sidebarLogo}>
          <div style={{
            background: 'var(--color-primary-glow)',
            border: '1px solid var(--border-default)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf size={16} color="var(--color-primary)" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Agro<span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Smart Farm Platform</span>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {NAV_SECTIONS.map((section, idx) => {
          if (section.title === 'Overview') {
            const active = location.pathname === '/dashboard'
            return (
              <Link key="dashboard" to="/dashboard" style={{
                ...styles.navItem,
                background: active ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                color: active ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
                borderLeft: active ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )
          }

          if (section.items.length === 1) {
            const item = section.items[0]
            const active = location.pathname === item.path
            const Icon = section.icon || Sprout
            return (
              <Link key={section.title} to={item.path} style={{
                ...styles.navItem,
                background: active ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                color: active ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
                borderLeft: active ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}>
                <Icon size={16} />
                {section.title}
              </Link>
            )
          }

          return (
            <NavSection
              key={idx}
              section={section}
              isOpen={!!openSections[idx]}
              onToggle={() => toggleSection(idx)}
              location={location}
            />
          )
        })}


        {/* Profile & Admin */}
        <div style={{ marginTop: 8, borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{
              ...styles.navItem,
              color: location.pathname.startsWith('/admin') ? 'var(--color-gold)' : 'var(--text-secondary)',
              background: location.pathname.startsWith('/admin') ? 'rgba(234,179,8,0.06)' : 'transparent',
              borderLeft: location.pathname.startsWith('/admin') ? '2.5px solid var(--color-gold)' : '2.5px solid transparent',
              fontWeight: location.pathname.startsWith('/admin') ? '600' : '400',
            }}>
              <Settings size={14} /> Admin Panel
            </Link>
          )}
          <Link to="/profile" style={{
            ...styles.navItem,
            color: location.pathname === '/profile' ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
            background: location.pathname === '/profile' ? 'rgba(34,197,94,0.08)' : 'transparent',
            borderLeft: location.pathname === '/profile' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            fontWeight: location.pathname === '/profile' ? '600' : '400',
          }}>
            <User size={14} /> My Profile
          </Link>
        </div>
      </nav>

      {/* Bottom brand box */}
      <div style={styles.sidebarFooter}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          🌱 AgroAI v1.0<br />
          <span style={{ color: 'var(--text-dim)' }}>Powered by AI & ML</span>
        </div>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    position: 'fixed',
    top: 'var(--navbar-height)',
    left: 0,
    width: 'var(--sidebar-width)',
    height: 'calc(100vh - var(--navbar-height))',
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-default)',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 800,
    backdropFilter: 'blur(12px)',
  },
  sidebarHeader: {
    padding: '16px 16px 12px',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  nav: {
    padding: '10px 8px',
    flex: 1,
  },
  sectionHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 8px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    marginBottom: 2,
    fontFamily: 'Outfit, sans-serif',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 12px',
    borderRadius: 8,
    fontSize: '0.845rem',
    textDecoration: 'none',
    transition: 'all 0.15s',
    marginBottom: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sidebarFooter: {
    padding: 16,
    borderTop: '1px solid var(--border-subtle)',
    marginTop: 'auto',
  },
}
