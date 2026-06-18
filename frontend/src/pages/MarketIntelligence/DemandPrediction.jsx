import React, { useState } from 'react'
import { getPricePrediction } from '../../services/marketService'

export default function Demandprediction() {
  const [image, setImage] = useState(null)
  const [location, setLocation] = useState({ lat: 22.9734, lon: 78.6569 }) // default center India
  const [mapSrc, setMapSrc] = useState(`https://www.google.com/maps?q=${22.9734},${78.6569}&z=6&output=embed`)
  const [prediction, setPrediction] = useState(null)
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [forecastMonths, setForecastMonths] = useState(3)
  const [loading, setLoading] = useState(false)

  function handleImage(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setImage(url)
  }

  function useMyLocation() {
    if (!navigator.geolocation) return alert('Geolocation not available')
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setLocation({ lat, lon })
      setMapSrc(`https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`)
    }, err => {
      alert('Unable to get location: ' + err.message)
    })
  }

  async function runPrediction() {
    setLoading(true)
    try {
      const data = await getPricePrediction(selectedCrop, forecastMonths)
      if (data.success) {
        // Use predictions returned by backend
        const latestPred = data.predictions[data.predictions.length - 1]
        const sentiment = data.market_sentiment
        
        setPrediction({
          demandIndex: latestPred.price,
          note: `Forecast: ${latestPred.demand} Demand (${latestPred.confidence}% confidence). Sentiment is ${sentiment}.`,
          sentiment: sentiment,
          demandStatus: latestPred.demand
        })

        // persist prediction to history
        const raw = localStorage.getItem('demand_predictions')
        const list = raw ? JSON.parse(raw) : []
        const record = {
          id: Date.now(),
          crop: selectedCrop,
          demandIndex: latestPred.price,
          note: `Forecast: ${latestPred.demand} Demand. Sentiment is ${sentiment}.`,
          image: image || null,
          location,
          createdAt: new Date().toISOString()
        }
        list.unshift(record)
        localStorage.setItem('demand_predictions', JSON.stringify(list.slice(0, 50)))
        setHistory(list.slice(0, 50))
      }
    } catch (e) {
      console.error(e)
      alert("Failed to run prediction. Ensure the backend Flask server is running.")
    } finally {
      setLoading(false)
    }
  }

  // load history
  const [history, setHistory] = React.useState(() => {
    try {
      const raw = localStorage.getItem('demand_predictions')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  React.useEffect(() => {
    function onStorage() {
      try { const raw = localStorage.getItem('demand_predictions'); setHistory(raw ? JSON.parse(raw) : []) } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])


  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>📈 Demand & Price Prediction</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select a crop and query our AI forecasting model to analyze price trends and demand sentiments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }} className="animate-fade-in stagger-1">
        {/* Form and parameters */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--text-primary)' }}>🔮 Forecasting Engine</h3>
          <div className="form-group">
            <label className="form-label">Select Target Crop</label>
            <select className="form-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Corn">Corn (Maize)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Prediction Horizon (Months)</label>
            <input 
              type="number" 
              className="form-input" 
              min="1" 
              max="12" 
              value={forecastMonths} 
              onChange={e => setForecastMonths(Number(e.target.value) || 3)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Field/Leaf Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImage} style={{ marginTop: 8 }} />
            {image && <img src={image} alt="preview" style={{ width: '100%', marginTop: 8, borderRadius: 12, border: '1px solid var(--border-subtle)' }} />}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={useMyLocation} type="button" style={{ flex: 1 }}>Location</button>
            <button className="btn btn-primary" onClick={runPrediction} type="button" disabled={loading} style={{ flex: 1 }} id="predict-price-btn">
              {loading ? 'Analyzing...' : 'Predict'}
            </button>
          </div>
          
          {prediction && (
            <div style={{ marginTop: 18, padding: 14, background: 'var(--color-primary-glow)', border: '1px solid var(--border-default)', borderRadius: 12 }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Forecast Price: ₹{prediction.demandIndex.toLocaleString()}/q</div>
              <div style={{ color: 'var(--color-primary-dark)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>Sentiment: {prediction.sentiment} ({prediction.demandStatus} Demand)</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 6, lineHeight: 1.4 }}>{prediction.note}</div>
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div className="card">
          <h3 style={{ marginBottom: 14, fontSize: '1rem', color: 'var(--text-primary)' }}>📍 Farm Location Tracker</h3>
          <div style={{ height: 320, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <iframe title="map" src={mapSrc} style={{ width: '100%', height: '100%', border: 0 }} />
          </div>
          <div style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Coordinates: {location.lat.toFixed(5)}° N, {location.lon.toFixed(5)}° E</div>
        </div>
      </div>

      <section style={{ marginTop: 32 }} className="animate-fade-in stagger-2">
        <h3 style={{ color: 'var(--text-primary)' }}>Prediction History Logs</h3>
        {history.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>No predictions run yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {history.map(h => (
              <div key={h.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
                {h.image ? <img src={h.image} alt="p" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 8 }} /> : <div style={{ width: 80, height: 50, background: 'var(--bg-dark)', borderRadius: 8 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{h.crop || 'Crop'}: <span style={{ color: 'var(--color-primary-dark)' }}>₹{h.demandIndex?.toLocaleString()}/q</span></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{h.note} • {new Date(h.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <a className="btn btn-ghost btn-sm" href={`https://www.google.com/maps?q=${h.location.lat},${h.location.lon}`} target="_blank" rel="noreferrer">View Map</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
