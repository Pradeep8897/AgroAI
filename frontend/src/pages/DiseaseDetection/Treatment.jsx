import React, { useEffect, useState } from 'react'

const TREATMENTS = {
  early_blight: [
    { id: 't1', title: 'Copper fungicide', notes: 'Apply as per label; protective equipment required.' },
    { id: 't2', title: 'Remove affected leaves', notes: 'Sanitize pruners between cuts.' },
  ],
  late_blight: [
    { id: 't3', title: 'Systemic fungicide (mancozeb/metalaxyl mix)', notes: 'High severity — follow withdrawal periods.' },
  ],
  leaf_spot: [
    { id: 't4', title: 'Improve drainage and airflow', notes: 'Cultural control first.' },
  ],
}

export default function Treatment() {
  const [scan, setScan] = useState(null)
  const [applied, setApplied] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lastDiseaseScan')
      if (raw) setScan(JSON.parse(raw))
    } catch (e) {}

    try {
      const raw2 = localStorage.getItem('treatmentApplied')
      if (raw2) setApplied(JSON.parse(raw2))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('treatmentApplied', JSON.stringify(applied)) } catch (e) {}
  }, [applied])

  function markApplied(t) {
    setApplied(prev => [{ ...t, appliedAt: new Date().toISOString() }, ...prev].slice(0, 20))
  }

  const diseaseId = scan?.disease?.id
  const options = diseaseId ? TREATMENTS[diseaseId] || [] : []

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>💊 Disease Treatment Library</h1>
        <p style={{ color: 'var(--text-muted)' }}>Suggested treatments based on last disease scan. You can mark actions as applied to keep a log.</p>
      </div>

      {scan ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }} className="animate-fade-in stagger-1">
          {/* Active Treatments */}
          <div className="card">
            <h3 style={{ marginBottom: 14, color: 'var(--text-primary)' }}>📋 Actionable Recommendations</h3>
            <div style={{ marginBottom: 16, background: 'var(--bg-dark)', padding: 14, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 4 }}>{scan.disease.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Crop: <strong>{scan.disease.crop}</strong> • Scan Confidence: <strong style={{ color: 'var(--color-primary-dark)' }}>{scan.confidence}%</strong>
              </div>
            </div>

            {options.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No preconfigured treatment found for this disease.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {options.map(t => (
                  <div key={t.id} style={{ padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>{t.notes}</div>
                    </div>
                    <div>
                      <button className="btn btn-primary btn-sm" onClick={() => markApplied(t)}>Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applied Actions History */}
          <div className="card">
            <h3 style={{ marginBottom: 14, color: 'var(--text-primary)' }}>✅ Applied Actions Log</h3>
            {applied.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No actions logged yet. Click "Apply" above to log a treatment action.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {applied.map(a => (
                  <div key={a.appliedAt} style={{ padding: 12, background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{a.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>
                        Applied: {new Date(a.appliedAt).toLocaleString()}
                      </div>
                    </div>
                    <span className="badge badge-success">Applied</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.placeholder} className="animate-fade-in stagger-1">
          <h3 style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>No Active Diagnosis Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: 280, margin: '8px auto 0 auto' }}>
            Run a disease diagnostic scan from the camera detection or simulation pages to load treatments.
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-card)',
    border: '1.5px dashed var(--border-subtle)',
    borderRadius: 16,
    padding: '40px',
    textAlign: 'center',
    minHeight: 220,
    marginTop: 20,
  }
}
