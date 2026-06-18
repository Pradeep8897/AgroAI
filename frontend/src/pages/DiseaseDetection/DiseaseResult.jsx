import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SAMPLE_DISEASES = [
  { id: 'early_blight', name: 'Early Blight', crop: 'Tomato', severity: 'Medium', treatmentId: 'tb1' },
  { id: 'late_blight', name: 'Late Blight', crop: 'Potato', severity: 'High', treatmentId: 'tb2' },
  { id: 'leaf_spot', name: 'Leaf Spot', crop: 'Rice', severity: 'Low', treatmentId: 'tb3' },
]

export default function Diseaseresult() {
  const [disease, setDisease] = useState(SAMPLE_DISEASES[0].id)
  const [confidence, setConfidence] = useState(85)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('diseaseScanHistory')
      if (raw) setHistory(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('diseaseScanHistory', JSON.stringify(history)) } catch (e) {}
  }, [history])

  function saveScan(e) {
    e.preventDefault()
    const found = SAMPLE_DISEASES.find(d => d.id === disease)
    const rec = { id: Date.now(), disease: found, confidence: Number(confidence), time: new Date().toISOString() }
    setHistory(prev => [rec, ...prev].slice(0, 20))
    // Save last scan for Treatment page convenience
    try { localStorage.setItem('lastDiseaseScan', JSON.stringify(rec)) } catch (e) {}
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>🦠 Disease Diagnosis History</h1>
        <p style={{ color: 'var(--text-muted)' }}>Simulate or save a disease detection result. Saved scans appear in history and can be used to open treatment suggestions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }} className="animate-fade-in stagger-1">
        {/* Simulate Scan Form */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--text-primary)' }}>🧪 Simulate Disease Scan</h3>
          <form onSubmit={saveScan} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Select Disease</label>
              <select className="form-select" value={disease} onChange={e => setDisease(e.target.value)}>
                {SAMPLE_DISEASES.map(d => <option key={d.id} value={d.id}>{d.name} ({d.crop})</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Confidence %</label>
              <input type="number" min="0" max="100" className="form-input" value={confidence} onChange={e => setConfidence(e.target.value)} />
            </div>

            <button className="btn btn-primary" type="submit" id="save-scan-submit">Save Scan</button>
          </form>
        </div>

        {/* Latest Scan Preview */}
        <div className="card" style={{ border: '1px solid var(--border-active)', background: 'var(--bg-card)' }}>
          <h3 style={{ marginBottom: 12, fontSize: '1rem', color: 'var(--text-primary)' }}>📋 Latest Scan Preview</h3>
          <div style={{ padding: 14, background: 'var(--bg-dark)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              {SAMPLE_DISEASES.find(d => d.id === disease).name}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Crop: <strong>{SAMPLE_DISEASES.find(d => d.id === disease).crop}</strong> • Severity: <span style={{ fontWeight: 600, color: SAMPLE_DISEASES.find(d => d.id === disease).severity === 'High' ? 'var(--color-danger)' : 'var(--color-gold)' }}>{SAMPLE_DISEASES.find(d => d.id === disease).severity}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Confidence: <strong>{confidence}%</strong>
            </div>
            <div style={{ marginTop: 14 }}>
              <Link to="/treatment" className="btn btn-primary btn-sm btn-block">Open Treatment Guide</Link>
            </div>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 32 }} className="animate-fade-in stagger-2">
        <h3 style={{ marginBottom: 14, color: 'var(--text-primary)' }}>Scan History Logs</h3>
        {history.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No scans saved yet.</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 760 }}>
            {history.map(h => (
              <div key={h.id} style={{ padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{h.disease.name} • {new Date(h.time).toLocaleString()}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                    Crop: {h.disease.crop} • Confidence: {h.confidence}% • Severity: {h.disease.severity}
                  </div>
                </div>
                <div>
                  <Link to="/treatment" className="btn btn-secondary btn-sm" onClick={() => { try { localStorage.setItem('lastDiseaseScan', JSON.stringify(h)) } catch(e){} }}>View Treatment</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
