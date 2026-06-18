import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Loader2, Plus, X, MapPin, Phone, Clock, Tractor, Sprout, Droplets, Wrench, Settings } from 'lucide-react'
import { API_BASE } from '../../services/apiConfig'

export default function Equipmentlist() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalError, setModalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    name: '',
    type: 'Tractor',
    owner: '',
    rate_per_hour: '',
    rate_per_day: '',
    location: '',
    phone: '',
  })

  const fetchEquipment = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/equipment`)
      const j = await res.json()
      if (!j.success) throw new Error('Failed to fetch equipment')
      setEquipment(j.equipment || [])
    } catch (e) {
      console.warn('Equipment API failed', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  const handleAddEquipment = async (e) => {
    e.preventDefault()
    setModalError('')
    setSubmitting(true)
    
    try {
      const res = await fetch(`${API_BASE}/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setForm({
          name: '',
          type: 'Tractor',
          owner: '',
          rate_per_hour: '',
          rate_per_day: '',
          location: '',
          phone: '',
        })
        setShowAddModal(false)
        fetchEquipment()
      } else {
        setModalError(data.message || 'Failed to add equipment.')
      }
    } catch (err) {
      setModalError('Backend unreachable. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getEquipmentIcon = (type) => {
    const t = type.toLowerCase()
    if (t.includes('tractor')) return <Tractor size={26} color="#22c55e" />
    if (t.includes('harvester')) return <Sprout size={26} color="#eab308" />
    if (t.includes('sprayer')) return <Droplets size={26} color="#3b82f6" />
    if (t.includes('rotavator') || t.includes('tiller')) return <Wrench size={26} color="#8b5cf6" />
    if (t.includes('seed') || t.includes('drill')) return <Sprout size={26} color="#10b981" />
    return <Settings size={26} color="#6b7280" />
  }

  const getStatusBadge = (avail) => {
    if (avail === 1 || avail === true) {
      return (
        <span style={{ 
          ...styles.statusBadge, 
          background: 'rgba(34, 197, 94, 0.12)', 
          color: '#22c55e', 
          border: '1px solid rgba(34, 197, 94, 0.2)' 
        }}>
          available
        </span>
      )
    } else {
      return (
        <span style={{ 
          ...styles.statusBadge, 
          background: 'rgba(239, 68, 68, 0.12)', 
          color: '#ef4444', 
          border: '1px solid rgba(239, 68, 68, 0.2)' 
        }}>
          booked
        </span>
      )
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header} className="animate-fade-in">
        <div>
          <h1 style={styles.pageTitle}>Equipment Rental</h1>
          <p style={styles.pageSubtitle}>Rent tractors, harvesters & more</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.addBtn} id="btn-add-equipment">
          <Plus size={16} style={{ marginRight: 6 }} /> Add
        </button>
      </div>

      {/* Equipment List */}
      <div style={styles.listingsList} className="animate-fade-in stagger-1">
        {loading ? (
          <div style={styles.loadingState}>
            <Loader2 size={36} className="animate-spin" color="#22c55e" />
            <p style={{ marginTop: 12 }}>Loading available equipment...</p>
          </div>
        ) : equipment.length > 0 ? (
          equipment.map(eq => (
            <div key={eq.id} style={styles.eqCard} className="animate-fade-in">
              <div style={styles.cardLeft}>
                {/* Dynamic circular icon circle */}
                <div style={styles.iconCircle}>
                  {getEquipmentIcon(eq.type || '')}
                </div>
                
                {/* Equipment details */}
                <div style={styles.cardInfo}>
                  <Link to={`/equipment/book/${eq.id}`} style={styles.cardTitle} id={`eq-title-${eq.id}`}>
                    {eq.name}
                  </Link>
                  <p style={styles.cardSubtitle}>
                    {eq.type} • {eq.owner || 'Farmer'}
                  </p>
                  
                  {/* Rates Row */}
                  <div style={styles.ratesRow}>
                    <div style={styles.rateHour}>
                      <Clock size={14} />
                      <span>₹{eq.rate_per_hour}/hr</span>
                    </div>
                    <div style={styles.rateDay}>
                      <span>₹{eq.rate_per_day || (eq.rate_per_hour * 8)}/day</span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                      <MapPin size={14} style={{ color: '#ef4444' }} />
                      <span>{eq.location || 'Local area'}</span>
                    </div>
                    <a href={`tel:${eq.phone || '+919876543210'}`} style={styles.callLink} id={`call-eq-${eq.id}`}>
                      <Phone size={14} />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card Right: Availability Status Badge */}
              <div style={styles.cardRight}>
                {getStatusBadge(eq.availability)}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <Search size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>{error ? 'No equipment currently available.' : 'No equipment listings found.'}</p>
          </div>
        )}
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="animate-fade-in">
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>List Equipment for Rent</h2>
              <button onClick={() => setShowAddModal(false)} style={styles.closeBtn} id="close-eq-modal">
                <X size={20} />
              </button>
            </div>
            
            {modalError && <div style={styles.modalError}>{modalError}</div>}
            
            <form onSubmit={handleAddEquipment} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Equipment Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mahindra 575 DI Tractor"
                  value={form.name} 
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={styles.formInput}
                  required
                  id="form-eq-name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Equipment Type</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  style={styles.formSelect}
                  required
                  id="form-eq-type"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Sprayer">Sprayer</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Seed_drill">Seed Drill</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Owner Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Patil"
                  value={form.owner} 
                  onChange={e => setForm(p => ({ ...p, owner: e.target.value }))}
                  style={styles.formInput}
                  required
                  id="form-eq-owner"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Rate per Hour (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 800"
                    value={form.rate_per_hour} 
                    onChange={e => setForm(p => ({ ...p, rate_per_hour: e.target.value }))}
                    style={styles.formInput}
                    required
                    id="form-eq-rate-hour"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Rate per Day (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000"
                    value={form.rate_per_day} 
                    onChange={e => setForm(p => ({ ...p, rate_per_day: e.target.value }))}
                    style={styles.formInput}
                    required
                    id="form-eq-rate-day"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nashik, Maharashtra"
                  value={form.location} 
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  style={styles.formInput}
                  required
                  id="form-eq-location"
                />
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
                  id="form-eq-phone"
                />
              </div>

              <button 
                type="submit" 
                style={styles.submitBtn}
                disabled={submitting}
                id="form-eq-submit"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : 'List Equipment'}
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
    marginBottom: 28,
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
  addBtn: {
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
  listingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  eqCard: {
    background: '#0c1b12',
    border: '1px solid #16301f',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    textAlign: 'left',
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#08130d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #16301f',
    flexShrink: 0,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: 700,
    textDecoration: 'none',
    margin: 0,
    transition: 'color 0.2s',
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.85rem',
    margin: 0,
  },
  ratesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '4px 0',
  },
  rateHour: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#22c55e',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  rateDay: {
    color: '#f59e0b',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  callLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#22c55e',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'lowercase',
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

