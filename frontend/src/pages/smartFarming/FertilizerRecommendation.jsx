import React, { useEffect, useState } from 'react'
import { getFertilizerRecommendation } from '../../services/cropService'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const CROP_TARGETS = {
  rice: { N: 120, P: 60, K: 40 },
  wheat: { N: 100, P: 50, K: 30 },
  maize: { N: 140, P: 60, K: 60 },
  tomato: { N: 80, P: 60, K: 80 },
}

export default function Fertilizerrecommendation() {
  const [crop, setCrop] = useState('rice')
  const [area, setArea] = useState(1) // hectares
  const [soilN, setSoilN] = useState(0)
  const [soilP, setSoilP] = useState(0)
  const [soilK, setSoilK] = useState(0)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fertRecommendationHistory')
      if (raw) setHistory(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('fertRecommendationHistory', JSON.stringify(history))
    } catch (e) {}
  }, [history])

  async function computeRecommendation(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await getFertilizerRecommendation({
        crop,
        N: Number(soilN),
        P: Number(soilP),
        K: Number(soilK)
      })
      if (data.success) {
        const needN = Math.max(0, data.ideal_profile.N - data.soil_profile.N) * Number(area)
        const needP = Math.max(0, data.ideal_profile.P - data.soil_profile.P) * Number(area)
        const needK = Math.max(0, data.ideal_profile.K - data.soil_profile.K) * Number(area)

        const rec = {
          id: Date.now(),
          crop: data.crop,
          area: Number(area),
          soil: data.soil_profile,
          ideal: data.ideal_profile,
          recommended: { N: Math.round(needN), P: Math.round(needP), K: Math.round(needK) },
          details: data.recommendations,
          createdAt: new Date().toISOString(),
        }
        setResult(rec)
        setHistory(prev => [rec, ...prev].slice(0, 20))
      } else {
        setError(data.message || 'Failed to get recommendation.')
      }
    } catch (err) {
      console.warn("Failed to get backend recommendation, falling back to local model", err)
      setError("Calculated using offline baselines (Backend connection failed).")
      
      const target = CROP_TARGETS[crop.toLowerCase()] || { N: 0, P: 0, K: 0 }
      const needN = Math.max(0, target.N - Number(soilN)) * Number(area)
      const needP = Math.max(0, target.P - Number(soilP)) * Number(area)
      const needK = Math.max(0, target.K - Number(soilK)) * Number(area)

      const rec = {
        id: Date.now(),
        crop,
        area: Number(area),
        soil: { N: Number(soilN), P: Number(soilP), K: Number(soilK) },
        recommended: { N: Math.round(needN), P: Math.round(needP), K: Math.round(needK) },
        details: [
          {
            nutrient: "NPK Profile",
            status: "Baselines used",
            treatment: "Apply standard chemical NPK according to baseline crop requirements.",
            organic_alternative: "Use cow dung compost or green manure to enrich overall soil structure."
          }
        ],
        createdAt: new Date().toISOString(),
      }
      setResult(rec)
      setHistory(prev => [rec, ...prev].slice(0, 20))
    } finally {
      setLoading(false)
    }
  }

  function removeHistory(id) {
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>🌱 Fertilizer Recommendation</h1>
        <p>Enter basic soil tests and area to get a quick chemical and organic N/P/K recipe.</p>
      </div>

      <form onSubmit={computeRecommendation} style={{ maxWidth: 760, marginTop: 18 }} className="card animate-fade-in stagger-1">
        {error && (
          <div className="alert alert-warning" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <label style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
            Target Crop
            <select className="form-select" value={crop} onChange={e => setCrop(e.target.value)}>
              {Object.keys(CROP_TARGETS).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>

          <label style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
            Area (hectares)
            <input type="number" min="0.01" step="0.01" className="form-input" value={area} onChange={e => setArea(e.target.value)} />
          </label>

          <label style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
            Soil N (mg/kg)
            <input type="number" className="form-input" value={soilN} onChange={e => setSoilN(e.target.value)} />
          </label>

          <label style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
            Soil P (mg/kg)
            <input type="number" className="form-input" value={soilP} onChange={e => setSoilP(e.target.value)} />
          </label>

          <label style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
            Soil K (mg/kg)
            <input type="number" className="form-input" value={soilK} onChange={e => setSoilK(e.target.value)} />
          </label>
        </div>

        <div>
          <button className="btn btn-primary" type="submit" disabled={loading} id="fert-rec-submit">
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Calculating...</> : 'Get AI Recommendation'}
          </button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 20, maxWidth: 760 }} className="card animate-fade-in">
          <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: 14 }}>Recommendation for {result.crop.toUpperCase()}</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flexWrap: 'wrap', marginTop: 14 }}>
            <div style={{ padding: 16, background: 'var(--color-primary-glow)', border: '1px solid var(--border-subtle)', borderRadius: 12, minWidth: 220, flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Nutrient Needs (kg)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontWeight: 850, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Nitrogen (N): <span style={{ color: 'var(--color-primary-dark)' }}>{result.recommended.N} kg</span></div>
                <div style={{ fontWeight: 850, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Phosphorus (P): <span style={{ color: 'var(--color-primary-dark)' }}>{result.recommended.P} kg</span></div>
                <div style={{ fontWeight: 850, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Potassium (K): <span style={{ color: 'var(--color-primary-dark)' }}>{result.recommended.K} kg</span></div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <div>Area: {result.area} ha</div>
                <div>Soil input NPK: {result.soil.N}, {result.soil.P}, {result.soil.K}</div>
              </div>
            </div>

            {result.details && result.details.length > 0 && (
              <div style={{ flex: '2 1 340px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700 }}>📋 Actionable Fertilizer Recipes</h4>
                {result.details.map((detail, idx) => (
                  <div key={idx} style={{ padding: 12, background: 'var(--bg-dark)', borderRadius: 10, border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-info)', marginBottom: 4 }}>{detail.nutrient} ({detail.status})</div>
                    <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--color-danger)' }}>Chemical: </strong>{detail.treatment}</div>
                    <div><strong style={{ color: 'var(--color-primary-dark)' }}>Organic: </strong>{detail.organic_alternative}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <section style={{ marginTop: 30, maxWidth: 760 }} className="animate-fade-in stagger-2">
        <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>Recent Recommendations</h3>
        {history.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent recommendations.</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{h.crop.toUpperCase()} • {new Date(h.createdAt).toLocaleString()}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 3 }}>Area {h.area} ha — N:{h.recommended.N}kg P:{h.recommended.P}kg K:{h.recommended.K}kg</div>
                </div>
                <div>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeHistory(h.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
