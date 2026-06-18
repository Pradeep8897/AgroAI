import React, { useState, useEffect } from 'react'
import { Search, Loader2, Plus, X, MapPin, Package, Phone } from 'lucide-react'
import { useAuth } from '../../App'
import { API_BASE } from '../../services/apiConfig'

export default function Products() {
  const { user } = useAuth()
  
  // State variables
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  
  // Modal state variables
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalError, setModalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    category: 'Sell Crop',
    title: '',
    description: '',
    price: '',
    unit: 'quintal',
    location: '',
    quantity: '',
    phone: '',
  })

  // Load listings from API
  const loadListings = async () => {
    setLoading(true)
    try {
      const catParam = category !== 'All' ? encodeURIComponent(category) : ''
      const searchParam = search ? encodeURIComponent(search) : ''
      const url = `${API_BASE}/listings?category=${catParam}&search=${searchParam}`
      
      const res = await fetch(url)
      const data = await res.json()
      if (data.success && data.listings) {
        setListings(data.listings)
      } else {
        console.error("Failed to load listings:", data.message)
      }
    } catch (err) {
      console.error("Error fetching listings from backend:", err)
    } finally {
      setLoading(false)
    }
  }

  // Reload when category or search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadListings()
    }, 300) // debounce search inputs

    return () => clearTimeout(delayDebounce)
  }, [category, search])

  // Handle Form Submission for new listing
  const handleCreateListing = async (e) => {
    e.preventDefault()
    setModalError('')
    setSubmitting(true)
    
    try {
      const res = await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          user_id: user?.id || null
        })
      })
      const data = await res.json()
      if (data.success) {
        // Clear form and close modal
        setForm({
          category: 'Sell Crop',
          title: '',
          description: '',
          price: '',
          unit: 'quintal',
          location: '',
          quantity: '',
          phone: '',
        })
        setShowAddModal(false)
        loadListings() // Reload list
      } else {
        setModalError(data.message || 'Failed to create listing.')
      }
    } catch (err) {
      setModalError('Backend service is unreachable. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  // Get dynamic styles for badges based on category
  const getBadgeStyle = (cat) => {
    switch (cat) {
      case 'Sell Crop':
        return { background: '#ffffff', color: '#16a34a' }
      case 'Buy Crop':
        return { background: '#ffffff', color: '#2563eb' }
      case 'Equipment Rent':
        return { background: '#ffffff', color: '#ea580c' }
      case 'Equipment Sell':
        return { background: '#ffffff', color: '#7c3aed' }
      default:
        return { background: '#ffffff', color: '#22c55e' }
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header} className="animate-fade-in">
        <div>
          <h1 style={styles.pageTitle}>Marketplace</h1>
          <p style={styles.pageSubtitle}>Buy, sell & rent</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.listBtn} id="btn-add-listing">
          <Plus size={16} style={{ marginRight: 6 }} /> List
        </button>
      </div>

      {/* Search Input */}
      <div style={styles.searchContainer} className="animate-fade-in stagger-1">
        <Search size={18} style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search listings..." 
          style={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="search-listings"
        />
      </div>

      {/* Categories Tabs */}
      <div style={styles.catTabs} className="animate-fade-in stagger-2">
        {['All', 'Sell Crop', 'Buy Crop', 'Equipment Rent', 'Equipment Sell'].map(cat => (
          <button 
            key={cat} 
            style={{
              ...styles.catTab,
              background: category === cat ? '#22c55e' : 'transparent',
              color: category === cat ? '#ffffff' : '#a7f3d0',
              border: category === cat ? '1px solid #22c55e' : '1px solid #16301f',
            }}
            onClick={() => setCategory(cat)}
            id={`cat-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings list */}
      <div style={styles.listingsGrid} className="animate-fade-in stagger-3">
        {loading ? (
          <div style={styles.loadingState}>
            <Loader2 size={36} className="animate-spin" color="#22c55e" />
            <p style={{ marginTop: 12 }}>Loading listings...</p>
          </div>
        ) : listings.length > 0 ? (
          listings.map(item => (
            <div key={item.id} style={styles.listingCard} className="animate-fade-in">
              {/* Card Top Row: Badge & Price */}
              <div style={styles.cardHeader}>
                <span style={{ ...styles.badge, ...getBadgeStyle(item.category) }}>{item.category}</span>
                <div style={styles.priceContainer}>
                  <span style={styles.priceVal}>₹{parseFloat(item.price).toLocaleString('en-IN')}</span>
                  <span style={styles.priceUnit}>/{item.unit}</span>
                </div>
              </div>
              
              {/* Card Content: Title & Description */}
              <h3 style={styles.cardTitle}>{item.title}</h3>
              {item.description && <p style={styles.cardDesc}>{item.description}</p>}
              
              {/* Card Footer: Metadata (Location, Quantity, Call) */}
              <div style={styles.cardFooter}>
                <div style={styles.metaItem}>
                  <MapPin size={14} style={styles.metaIcon} />
                  <span>{item.location}</span>
                </div>
                <div style={styles.metaItem}>
                  <Package size={14} style={styles.metaIcon} />
                  <span>{item.quantity}</span>
                </div>
                <a href={`tel:${item.phone}`} style={styles.callLink} id={`call-listing-${item.id}`}>
                  <Phone size={14} style={{ marginRight: 4 }} />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <Search size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>No listings found. Be the first to add one!</p>
          </div>
        )}
      </div>

      {/* Add Listing Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="animate-fade-in">
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>Create New Listing</h2>
              <button onClick={() => setShowAddModal(false)} style={styles.closeBtn} id="close-modal">
                <X size={20} />
              </button>
            </div>
            
            {modalError && <div style={styles.modalError}>{modalError}</div>}
            
            <form onSubmit={handleCreateListing} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Listing Category</label>
                <select 
                  value={form.category} 
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={styles.formSelect}
                  required
                  id="form-category"
                >
                  <option value="Sell Crop">Sell Crop</option>
                  <option value="Buy Crop">Buy Crop</option>
                  <option value="Equipment Rent">Equipment Rent</option>
                  <option value="Equipment Sell">Equipment Sell</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paddy"
                  value={form.title} 
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={styles.formInput}
                  required
                  id="form-title"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea 
                  placeholder="e.g. Grade A basmati rice from Punjab. Fresh harvest, excellent quality."
                  value={form.description} 
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  style={styles.formTextarea}
                  rows={2}
                  id="form-description"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 2000"
                    value={form.price} 
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    style={styles.formInput}
                    required
                    id="form-price"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Unit</label>
                  <select
                    value={form.unit} 
                    onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    style={styles.formSelect}
                    id="form-unit"
                  >
                    <option value="quintal">quintal</option>
                    <option value="kg">kg</option>
                    <option value="hour">hour</option>
                    <option value="day">day</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Nellore"
                    value={form.location} 
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    style={styles.formInput}
                    required
                    id="form-location"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Quantity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 50 quintal"
                    value={form.quantity} 
                    onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                    style={styles.formInput}
                    required
                    id="form-quantity"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +91 98765 43210"
                  value={form.phone} 
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  style={styles.formInput}
                  required
                  id="form-phone"
                />
              </div>

              <button 
                type="submit" 
                style={styles.submitBtn}
                disabled={submitting}
                id="form-submit"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  pageContainer: {
    background: '#040d08',
    borderRadius: 24,
    padding: 32,
    margin: '-16px',
    minHeight: 'calc(100vh - 120px)',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
    color: '#ffffff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Outfit, sans-serif',
  },
  pageSubtitle: {
    fontSize: '0.95rem',
    color: '#a7f3d0',
    fontWeight: 500,
    margin: '4px 0 0 0',
  },
  listBtn: {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
    transition: 'all 0.2s',
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  searchInput: {
    width: '100%',
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 24,
    padding: '12px 14px 12px 42px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Outfit, sans-serif',
  },
  catTabs: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 24,
    scrollbarWidth: 'none', // hide firefox scrollbar
  },
  catTab: {
    padding: '8px 18px',
    borderRadius: 20,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    fontFamily: 'Outfit, sans-serif',
  },
  listingsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  listingCard: {
    background: '#0c1b12',
    border: '1px solid #16301f',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
  },
  priceVal: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#22c55e',
  },
  priceUnit: {
    fontSize: '0.78rem',
    color: '#a7f3d0',
    marginLeft: 2,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: 700,
    margin: '0 0 6px 0',
  },
  cardDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.88rem',
    margin: '0 0 16px 0',
    lineHeight: 1.5,
  },
  cardFooter: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    marginTop: 8,
    borderTop: '1px solid #16301f',
    paddingTop: 14,
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    color: '#a7f3d0',
  },
  metaIcon: {
    color: '#22c55e',
  },
  callLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#22c55e',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'opacity 0.2s',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
    color: '#a7f3d0',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
    color: '#a7f3d0',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },
  modalCard: {
    background: '#0c1b12',
    border: '1px solid #16301f',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '1px solid #16301f',
    paddingBottom: 12,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#a7f3d0',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
  },
  modalError: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: 10,
    borderRadius: 8,
    fontSize: '0.85rem',
    marginBottom: 16,
    textAlign: 'left',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    textAlign: 'left',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#a7f3d0',
    marginBottom: 6,
  },
  formInput: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Outfit, sans-serif',
  },
  formSelect: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  formTextarea: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'Outfit, sans-serif',
  },
  submitBtn: {
    background: '#22c55e',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '12px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.2s',
  },
}
