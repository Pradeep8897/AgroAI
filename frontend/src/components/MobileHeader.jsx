import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import {
  Menu, X, Leaf, Bell, User, LayoutDashboard, Sprout, Compass,
  Calendar, Bug, History, BookOpen, TrendingUp, LineChart,
  MapPin, ShoppingBag, Tractor, MessageSquare, Mic, Calculator,
  Scale, LogOut
} from 'lucide-react'

export default function MobileHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDrawerOpen(false)
    navigate('/login')
  }

  const navItems = [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      section: 'Smart Farming',
      items: [
        { label: 'Crop Recommendation', path: '/crop-recommendation', icon: Sprout },
        { label: 'Soil Analysis', path: '/soil-analysis', icon: Compass },
        { label: 'Fertilizer Recommendation', path: '/fertilizer', icon: Leaf },
        { label: 'Crop Calendar', path: '/crop-calendar', icon: Calendar }
      ]
    },
    {
      section: 'Disease Detection',
      items: [
        { label: 'Upload Leaf Image', path: '/disease-detect', icon: Bug },
        { label: 'Disease History', path: '/disease-result', icon: History },
        { label: 'Treatment Library', path: '/treatment', icon: BookOpen }
      ]
    },
    {
      section: 'Market Intelligence',
      items: [
        { label: 'Market Prices', path: '/market-prices', icon: TrendingUp },
        { label: 'Demand Prediction', path: '/demand-prediction', icon: LineChart },
        { label: 'Nearby Mandis', path: '/nearby-mandi', icon: MapPin }
      ]
    },
    {
      section: 'Marketplace & Rentals',
      items: [
        { label: 'Browse Products', path: '/marketplace', icon: ShoppingBag },
        { label: 'Browse Equipment', path: '/equipment', icon: Tractor },
        { label: 'Booking History', path: '/equipment/history', icon: History }
      ]
    },
    {
      section: 'AI Assistant',
      items: [
        { label: 'Chat Assistant', path: '/assistant', icon: MessageSquare },
        { label: 'Voice Assistant', path: '/voice-assistant', icon: Mic }
      ]
    },
    {
      section: 'Profit Optimizer',
      items: [
        { label: 'Cost Calculator', path: '/cost-calculator', icon: Calculator },
        { label: 'Profit Analysis', path: '/profit-analysis', icon: TrendingUp },
        { label: 'Revenue Estimator', path: '/revenue-estimator', icon: Scale }
      ]
    }
  ]

  return (
    <>
      <header style={styles.header} className="mobile-header">
        {/* Left Side: Hamburger & Brand */}
        <div style={styles.headerLeft}>
          <button 
            onClick={() => setDrawerOpen(true)}
            style={styles.menuBtn}
            aria-label="Open navigation drawer"
            id="mobile-drawer-toggle"
          >
            <Menu size={24} color="#ffffff" />
          </button>
          
          <Link to="/dashboard" style={styles.brandContainer}>
            <div style={styles.logoCircle}>
              <Leaf size={16} color="#ffffff" fill="#ffffff" />
            </div>
            <span style={styles.brandText}>
              Agro<span style={styles.brandAccent}>AI</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div style={styles.headerRight}>
          {/* Notifications */}
          <Link 
            to="/notifications" 
            style={styles.actionIcon} 
            id="mobile-notifications-btn"
          >
            <Bell size={20} />
            <span style={styles.notificationDot} />
          </Link>

          {/* Profile */}
          <Link 
            to="/profile" 
            style={styles.actionIcon} 
            id="mobile-profile-btn"
          >
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* Drawer Backdrop */}
      {drawerOpen && (
        <div 
          onClick={() => setDrawerOpen(false)}
          style={styles.backdrop}
        />
      )}

      {/* Navigation Drawer */}
      <div 
        style={{
          ...styles.drawer,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Drawer Header */}
        <div style={styles.drawerHeader}>
          <div style={styles.drawerBrand}>
            <div style={styles.logoCircle}>
              <Leaf size={16} color="#ffffff" fill="#ffffff" />
            </div>
            <span style={styles.brandText}>AgroAI</span>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)} 
            style={styles.closeBtn}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer User Summary */}
        <div style={styles.drawerUser}>
          <div style={styles.avatarCircle}>
            <User size={24} color="#ffffff" />
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.username || 'Pradeep Sangu'}</div>
            <div style={styles.userEmail}>{user?.email || 'pradeepsangu950@gmail.com'}</div>
            {user?.role && (
              <span style={styles.roleBadge}>{user.role}</span>
            )}
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div style={styles.drawerScrollContainer}>
          {navItems.map((section, sIdx) => (
            <div key={sIdx} style={styles.drawerSection}>
              <div style={styles.drawerSectionTitle}>{section.section}</div>
              <div style={styles.drawerSectionItems}>
                {section.items.map((item, iIdx) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        ...styles.drawerLink,
                        background: isActive ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                        color: isActive ? '#22c55e' : '#a7f3d0'
                      }}
                    >
                      <item.icon size={18} style={{ color: isActive ? '#22c55e' : '#7f8f86' }} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Account Actions */}
          <div style={styles.drawerSection}>
            <div style={styles.drawerSectionTitle}>Account</div>
            <div style={styles.drawerSectionItems}>
              <Link
                to="/profile"
                onClick={() => setDrawerOpen(false)}
                style={{
                  ...styles.drawerLink,
                  background: location.pathname === '/profile' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                  color: location.pathname === '/profile' ? '#22c55e' : '#a7f3d0'
                }}
              >
                <User size={18} style={{ color: location.pathname === '/profile' ? '#22c55e' : '#7f8f86' }} />
                <span>Profile Settings</span>
              </Link>
              <button 
                onClick={handleLogout}
                style={styles.drawerLogoutLink}
              >
                <LogOut size={18} style={{ color: '#ef4444' }} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  header: {
    background: '#040d08',
    borderBottom: '1px solid rgba(22, 48, 31, 0.5)',
    height: '60px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 990,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  logoCircle: {
    background: '#22c55e',
    borderRadius: '50%',
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
  },
  brandText: {
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1.2rem',
    fontFamily: 'Outfit, sans-serif',
  },
  brandAccent: {
    color: '#22c55e',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    color: '#7f8f86',
    textDecoration: 'none',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(22, 48, 31, 0.3)',
    transition: 'all 0.2s',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    background: '#ef4444',
    borderRadius: '50%',
    boxShadow: '0 0 6px #ef4444',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
  drawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '290px',
    maxWidth: '85vw',
    background: '#040d08',
    borderRight: '1px solid rgba(22, 48, 31, 0.5)',
    zIndex: 1010,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '10px 0 30px rgba(0, 0, 0, 0.6)',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'Outfit, sans-serif',
  },
  drawerHeader: {
    height: '60px',
    padding: '0 16px',
    borderBottom: '1px solid rgba(22, 48, 31, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#7f8f86',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  drawerUser: {
    padding: '20px 16px',
    borderBottom: '1px solid rgba(22, 48, 31, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'linear-gradient(180deg, rgba(22, 48, 31, 0.1) 0%, transparent 100%)',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflow: 'hidden',
  },
  userName: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    color: '#7f8f86',
    fontSize: '0.78rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    background: 'rgba(34, 197, 94, 0.15)',
    color: '#22c55e',
    padding: '2px 8px',
    borderRadius: 8,
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  drawerScrollContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  drawerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  drawerSectionTitle: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#475a4d',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingLeft: 8,
    marginBottom: 2,
  },
  drawerSectionItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  drawerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: '0.88rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  drawerLogoutLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: '0.88rem',
    fontWeight: 500,
    background: 'transparent',
    border: 'none',
    color: '#fca5a5',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    transition: 'all 0.2s',
  }
}
