import React, { useState } from 'react'
import { Sprout, Loader2, CheckCircle, Thermometer, Droplets, CloudRain, Sparkles } from 'lucide-react'
import { getCropRecommendation } from '../../services/cropService'
import { useAuth } from '../../App'
import { API_BASE } from '../../services/apiConfig'

const CROP_FACTS = {
  'Rice': { icon: '🌾', season: 'Kharif (Jun-Nov)', water: 'High (180-220cm)', temp: '20-35°C', family: 'Poaceae' },
  'Maize (Corn)': { icon: '🌽', season: 'Kharif / Rabi', water: 'Medium (60-110cm)', temp: '21-30°C', family: 'Poaceae' },
  'Wheat': { icon: '🌿', season: 'Rabi (Nov-Apr)', water: 'Low-Medium (40-60cm)', temp: '15-25°C', family: 'Poaceae' },
  'Cotton': { icon: '🌱', season: 'Kharif (Apr-Nov)', water: 'Medium (50-100cm)', temp: '25-35°C', family: 'Malvaceae' },
  'Coffee': { icon: '☕', season: 'Year-round', water: 'High (150-200cm)', temp: '15-28°C', family: 'Rubiaceae' },
}

export default function CropRecommendation() {
  const { user } = useAuth()
  const [form, setForm] = useState({ N: 50, P: 40, K: 35, ph: 6.5, soilType: 'loamy', temp: 28, humidity: 65, rainfall: 200 })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setResult(null)
    setLoading(true)
    try {
      const data = await getCropRecommendation({ ...form, user_id: user?.id || 0 })
      if (data.success) setResult(data)
      else setError(data.message || 'Recommendation failed.')
    } catch (err) {
      setError(`Backend unavailable at ${API_BASE}. Please ensure the Flask server is running. (Error: ${err.message})`)
    }
    setLoading(false)
  }

  const facts = result ? CROP_FACTS[result.top_recommendation] : null

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header} className="animate-fade-in">
        <h1 style={styles.pageTitle}>Smart Farming AI</h1>
        <p style={styles.pageSubtitle}>AI-powered crop & fertilizer recommendations</p>
      </div>

      <div style={styles.mainGrid}>
        {/* Input Form Card */}
        <div style={styles.card} className="animate-fade-in stagger-1">
          <h2 style={styles.cardTitle}>
            <span style={{ marginRight: 8 }}>🧪</span> Soil Analysis
          </h2>
          
          {error && <div style={styles.errorAlert}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Row 1: N, P, K */}
            <div style={styles.rowThree}>
              <div style={styles.formGroup}>
                <label style={{ ...styles.formLabel, color: '#22C55E' }}>N (kg/ha)</label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={form.N}
                  onChange={e => setForm(p => ({ ...p, N: parseFloat(e.target.value) || 0 }))}
                  id="crop-N"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={{ ...styles.formLabel, color: '#3B82F6' }}>P (kg/ha)</label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={form.P}
                  onChange={e => setForm(p => ({ ...p, P: parseFloat(e.target.value) || 0 }))}
                  id="crop-P"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={{ ...styles.formLabel, color: '#F97316' }}>K (kg/ha)</label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={form.K}
                  onChange={e => setForm(p => ({ ...p, K: parseFloat(e.target.value) || 0 }))}
                  id="crop-K"
                />
              </div>
            </div>

            {/* Row 2: pH level */}
            <div style={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={styles.formLabel}>pH Value</label>
                <span style={styles.phValueText}>{form.ph}</span>
              </div>
              <input
                type="range"
                min={3}
                max={10}
                step={0.1}
                value={form.ph}
                onChange={e => setForm(p => ({ ...p, ph: parseFloat(e.target.value) || 6.5 }))}
                style={styles.rangeInput}
                id="crop-ph"
              />
              <div style={styles.rangeLabels}>
                <span>Acidic (3)</span>
                <span>Neutral (7)</span>
                <span>Alkaline (10)</span>
              </div>
            </div>

            {/* Row 3: Soil Type */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Soil Type</label>
              <div style={{ position: 'relative' }}>
                <select
                  style={styles.selectInput}
                  value={form.soilType}
                  onChange={e => setForm(p => ({ ...p, soilType: e.target.value }))}
                  id="crop-soil-type"
                >
                  <option value="loamy">loamy</option>
                  <option value="sandy">sandy</option>
                  <option value="clayey">clayey</option>
                  <option value="silty">silty</option>
                  <option value="peaty">peaty</option>
                  <option value="saline">saline</option>
                </select>
              </div>
            </div>

            {/* Row 4: Temp, Humidity, Rain */}
            <div style={styles.rowThree}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <Thermometer size={14} style={{ marginRight: 4 }} />
                  Temp °C
                </label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={form.temp}
                  onChange={e => setForm(p => ({ ...p, temp: parseFloat(e.target.value) || 0 }))}
                  id="crop-temp"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <Droplets size={14} style={{ marginRight: 4 }} />
                  Humidity %
                </label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={form.humidity}
                  onChange={e => setForm(p => ({ ...p, humidity: parseFloat(e.target.value) || 0 }))}
                  id="crop-humidity"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <CloudRain size={14} style={{ marginRight: 4 }} />
                  Rain mm
                </label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={form.rainfall}
                  onChange={e => setForm(p => ({ ...p, rainfall: parseFloat(e.target.value) || 0 }))}
                  id="crop-rainfall"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" style={styles.submitBtn} disabled={loading} id="crop-rec-submit">
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite', marginRight: 8 }} />
                  Formulating Expert Advice...
                </>
              ) : (
                <>
                  <Sparkles size={16} style={{ marginRight: 8 }} />
                  Get AI Recommendations
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {result ? (
          <div style={styles.resultCard} className="animate-fade-in">
            <div style={styles.resultHeader}>
              <span style={styles.resultEmoji}>{facts?.icon || '🌱'}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Best Crop Recommendation</div>
                <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginTop: 4 }}>{result.top_recommendation}</h2>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Match Suitability</span>
                <span style={{ fontWeight: 700, color: '#86efac' }}>{result.score}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${result.score}%` }} />
              </div>
            </div>

            {facts && (
              <div style={styles.factGrid}>
                {[
                  { label: 'Growth Cycle Season', val: facts.season },
                  { label: 'Water Requirement', val: facts.water },
                  { label: 'Optimal Temperature', val: facts.temp },
                  { label: 'Botanical Family', val: facts.family },
                ].map(f => (
                  <div key={f.label} style={styles.factItem}>
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.88rem' }}>{f.val}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginBottom: 10, fontWeight: 700, letterSpacing: '0.06em' }}>ALTERNATIVE OPTIMAL CROPS:</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {result.alternatives?.map(a => (
                  <div key={a.crop} style={styles.altTag}>
                    {a.crop} <span style={{ color: '#22c55e', marginLeft: 4, fontWeight: 700 }}>{a.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={styles.successAlert}>
              <CheckCircle size={16} style={{ marginRight: 8, flexShrink: 0 }} />
              <span>Diagnostic parameters successfully recorded in farm history logs.</span>
            </div>
          </div>
        ) : !loading ? (
          <div style={styles.placeholder} className="animate-fade-in">
            <Sprout size={48} color="#22c55e" style={{ marginBottom: 16 }} />
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: 8 }}>AI Crop Diagnosis</h3>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
              Provide the soil and climate indices on the left and click "Get AI Recommendations" to compute ideal matches.
            </p>
          </div>
        ) : null}
      </div>
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
  },
  header: {
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: 6,
    fontFamily: 'Outfit, sans-serif',
  },
  pageSubtitle: {
    fontSize: '0.95rem',
    color: '#a7f3d0',
    fontWeight: 500,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 32,
    alignItems: 'start',
  },
  card: {
    background: '#0c1b12',
    border: '1px solid #16301f',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #16301f',
    paddingBottom: 12,
  },
  rowThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginBottom: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#a7f3d0',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  formInput: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    fontWeight: 600,
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  phValueText: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#22c55e',
  },
  rangeInput: {
    width: '100%',
    accentColor: '#22c55e',
    background: '#16301f',
    height: 6,
    borderRadius: 3,
    outline: 'none',
    cursor: 'pointer',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.72rem',
    color: 'var(--text-dim)',
    marginTop: 6,
    fontWeight: 500,
  },
  selectInput: {
    background: '#08130d',
    border: '1px solid #16301f',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    fontWeight: 600,
    width: '100%',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a7f3d0\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '14px',
    cursor: 'pointer',
  },
  submitBtn: {
    background: '#22c55e',
    color: '#ffffff',
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
    transition: 'all 0.2s ease',
  },
  resultCard: {
    background: '#0c1b12',
    border: '1.5px solid #22c55e',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  resultEmoji: {
    fontSize: '3.5rem',
    lineHeight: 1,
  },
  progressTrack: {
    height: 8,
    background: '#16301f',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #10b981)',
    borderRadius: 4,
  },
  factGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginTop: 8,
  },
  factItem: {
    background: '#08130d',
    borderRadius: 12,
    padding: '12px 14px',
    border: '1px solid #16301f',
  },
  altTag: {
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: '#a7f3d0',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    color: '#a7f3d0',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    fontSize: '0.8rem',
  },
  placeholder: {
    background: '#0c1b12',
    border: '1.5px dashed #16301f',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 40,
    minHeight: 320,
  },
  errorAlert: {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: 12,
    borderRadius: 10,
    fontSize: '0.88rem',
    marginBottom: 16,
    fontWeight: 600,
  },
}

