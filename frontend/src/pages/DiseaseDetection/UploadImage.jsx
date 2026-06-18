import React, { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle, XCircle, Leaf, AlertTriangle, FlaskConical } from 'lucide-react'
import { detectDisease } from '../../services/diseaseService'
import { useAuth } from '../../App'

export default function UploadImage() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, etc.)')
      return
    }
    setFile(f)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleDetect = async () => {
    if (!file) { setError('Please upload a leaf image first.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await detectDisease(file, user?.id)
      if (data.success) setResult(data)
      else setError(data.message || 'Detection failed.')
    } catch (err) {
      setError(`Backend unavailable at ${API_BASE}. Please ensure the Flask server is running. (Error: ${err.message})`)
    }
    setLoading(false)
  }

  const severityColor = { High: '#ef4444', Moderate: '#f59e0b', Low: '#22c55e' }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>🦠 AI Disease Detection</h1>
        <p>Upload a clear photo of an infected plant leaf to get instant disease diagnosis and treatment advice.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Upload Zone */}
        <div className="card animate-fade-in stagger-1">
          <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--text-primary)' }}>📸 Upload Leaf Image</h3>
          {error && <div className="alert alert-error">{error}</div>}

          <div
            className={`drop-zone ${dragOver ? 'dragover' : ''}`}
            style={{ padding: '40px 24px', marginBottom: 16 }}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="Leaf preview" style={{ maxHeight: 220, borderRadius: 12, objectFit: 'contain', marginBottom: 10 }} />
            ) : (
              <>
                <Upload size={40} color="var(--text-dim)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Drag & drop a leaf image here</p>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>or click to browse files</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} id="leaf-image-upload"
              onChange={e => handleFile(e.target.files[0])} />
          </div>

          {file && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}

          <button className="btn btn-primary btn-block btn-lg" onClick={handleDetect} disabled={loading || !file} id="disease-detect-btn">
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing Leaf...</> : '🔬 Detect Disease'}
          </button>

          <div style={styles.tipsBox}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary-dark)', marginBottom: 8 }}>📌 Tips for best results:</div>
            {['Use a clear, well-lit photo', 'Capture the underside of infected leaf', 'Avoid blurry or zoomed-out shots', 'One leaf per image works best'].map(tip => (
              <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <CheckCircle size={11} color="var(--color-primary)" /> {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="result-card animate-fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-active)' }}>
            {result.healthy ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={56} color="var(--color-primary)" style={{ marginBottom: 12 }} />
                <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: 8 }}>Crop Looks Healthy! 🎉</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <XCircle size={36} color={severityColor[result.severity] || '#f59e0b'} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Disease Detected</div>
                    <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>{result.disease}</h2>
                  </div>
                  <span style={{ marginLeft: 'auto' }} className={`badge ${result.severity === 'High' ? 'badge-danger' : result.severity === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>
                    {result.severity} Severity
                  </span>
                </div>

                <div style={styles.infoRow}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Crop:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{result.crop}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Confidence:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{result.confidence}%</span>
                </div>

                <div className="divider" />

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontSize: '0.875rem' }}>
                    <AlertTriangle size={15} color="#eab308" /> Root Cause
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{result.cause}</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8, fontSize: '0.875rem' }}>
                    <FlaskConical size={15} /> Chemical Treatment
                  </div>
                  <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 10, padding: '10px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {result.chemical_treatment}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 8, fontSize: '0.875rem' }}>
                    <Leaf size={15} /> Organic Treatment
                  </div>
                  <div style={{ background: 'var(--color-primary-glow)', border: '1px solid var(--border-glow)', borderRadius: 10, padding: '10px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {result.organic_treatment}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!result && !loading && (
          <div style={styles.placeholder} className="animate-fade-in stagger-2">
            <Leaf size={48} color="var(--text-dim)" style={{ marginBottom: 12 }} />
            <h3 style={{ color: 'var(--text-dim)', fontSize: '1rem', marginBottom: 8 }}>Disease Report</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Upload a leaf image and click "Detect Disease" to see instant AI diagnostics with treatment plans here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  tipsBox: { background: 'var(--color-primary-glow)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px', marginTop: 16 },
  placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', border: '1px dashed var(--border-subtle)', borderRadius: 24, padding: 40, textAlign: 'center', minHeight: 350 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
}
