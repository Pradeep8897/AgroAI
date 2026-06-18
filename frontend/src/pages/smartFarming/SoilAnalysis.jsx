import React, { useEffect, useState } from 'react'

function phCategory(ph) {
  if (ph === '' || ph === null) return 'Unknown'
  const v = Number(ph)
  if (isNaN(v)) return 'Invalid'
  if (v < 5.5) return 'Acidic'
  if (v <= 7.5) return 'Neutral'
  return 'Alkaline'
}

export default function Soilanalysis() {
  const [ph, setPh] = useState('6.5')
  const [n, setN] = useState('0')
  const [p, setP] = useState('0')
  const [k, setK] = useState('0')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('soilAnalysisHistory')
      if (raw) setHistory(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('soilAnalysisHistory', JSON.stringify(history)) } catch (e) {}
  }, [history])

  function analyze(e) {
    e.preventDefault()
    const phVal = Number(ph)
    const cat = phCategory(phVal)
    const suffN = Number(n) >= 50 ? 'Sufficient' : 'Low'
    const suffP = Number(p) >= 30 ? 'Sufficient' : 'Low'
    const suffK = Number(k) >= 40 ? 'Sufficient' : 'Low'

    const res = {
      id: Date.now(),
      ph: phVal,
      phCategory: cat,
      N: Number(n),
      P: Number(p),
      K: Number(k),
      sufficiency: { N: suffN, P: suffP, K: suffK },
      createdAt: new Date().toISOString(),
    }

    setResult(res)
    setHistory(prev => [res, ...prev].slice(0, 20))
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>🧪 Soil Analysis</h1>
        <p>Enter simple soil test values to get a quick analysis and recommendation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Input Form */}
        <div className="card animate-fade-in stagger-1">
          <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--text-primary)' }}>Soil Test Parameters</h3>
          <form onSubmit={analyze}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">pH Level</label>
                <input className="form-input" value={ph} onChange={e => setPh(e.target.value)} placeholder="6.5" id="soil-ph" />
              </div>
              <div className="form-group">
                <label className="form-label">Soil N (kg/ha)</label>
                <input className="form-input" value={n} onChange={e => setN(e.target.value)} id="soil-n" />
              </div>
              <div className="form-group">
                <label className="form-label">Soil P (kg/ha)</label>
                <input className="form-input" value={p} onChange={e => setP(e.target.value)} id="soil-p" />
              </div>
              <div className="form-group">
                <label className="form-label">Soil K (kg/ha)</label>
                <input className="form-input" value={k} onChange={e => setK(e.target.value)} id="soil-k" />
              </div>
            </div>
            <button className="btn btn-primary btn-block mt-md" type="submit" id="soil-analyze-submit">Analyze</button>
          </form>
        </div>

        {/* Result */}
        {result ? (
          <div className="result-card animate-fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: 14, fontSize: '1.1rem' }}>Analysis Result</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 14, background: 'var(--bg-dark)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 8 }}>
                  pH: {result.ph} • <span style={{ color: 'var(--color-primary-dark)' }}>{result.phCategory}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <div>Nitrogen (N): <strong>{result.N} kg/ha</strong> ({result.sufficiency.N})</div>
                  <div>Phosphorus (P): <strong>{result.P} kg/ha</strong> ({result.sufficiency.P})</div>
                  <div>Potassium (K): <strong>{result.K} kg/ha</strong> ({result.sufficiency.K})</div>
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 6 }}>💡 Key Recommendations:</div>
                <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {result.ph < 5.5 && <li>Apply agricultural lime to raise pH.</li>}
                  {result.ph > 7.5 && <li>Apply gypsum or sulfur to lower pH.</li>}
                  {result.sufficiency.N === 'Low' && <li>Apply nitrogen fertilizers (e.g. Urea) according to crop advice.</li>}
                  {result.sufficiency.P === 'Low' && <li>Add phosphorus-based fertilizers (e.g. DAP/SSP).</li>}
                  {result.sufficiency.K === 'Low' && <li>Apply muriate of potash (MOP) to boost potassium levels.</li>}
                  {result.ph >= 5.5 && result.ph <= 7.5 && result.sufficiency.N === 'Sufficient' && result.sufficiency.P === 'Sufficient' && result.sufficiency.K === 'Sufficient' && (
                    <li>Soil conditions are fully optimal! Continue crop rotation.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.placeholder} className="animate-fade-in stagger-2">
            <h3 style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: 700 }}>Soil Diagnostic Output</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', maxWidth: 280, margin: '8px auto 0 auto' }}>
              Fill in the parameters on the left and click "Analyze" to see detailed diagnostics here.
            </p>
          </div>
        )}
      </div>

      <section style={{ marginTop: 32, maxWidth: 760 }} className="animate-fade-in stagger-2">
        <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>Recent Analyses</h3>
        {history.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No analyses yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                    {new Date(h.createdAt).toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                    pH {h.ph} ({h.phCategory}) • N: {h.N} P: {h.P} K: {h.K}
                  </div>
                </div>
                <span className="badge badge-success">Saved</span>
              </div>
            ))}
          </div>
        )}
      </section>
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
  }
}
