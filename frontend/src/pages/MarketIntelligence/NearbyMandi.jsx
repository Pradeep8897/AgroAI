import React, { useState } from 'react'
import { getNearbyMandis } from '../../services/marketService'

const SAMPLE_MANDIS = [
  { id: 1, name: 'Azadpur Mandi', state: 'Delhi', lat: 28.6667, lon: 77.2167 },
  { id: 2, name: 'Yashwantpur Mandi', state: 'Karnataka', lat: 13.0200, lon: 77.5670 },
  { id: 3, name: 'Koyambedu Mandi', state: 'Tamil Nadu', lat: 13.0570, lon: 80.2090 },
]

export default function Nearbymandi() {
  const [photo, setPhoto] = useState(null)
  const [coords, setCoords] = useState({ lat: 22.9734, lon: 78.6569 })
  const [mapSrc, setMapSrc] = useState(`https://www.google.com/maps?q=${22.9734},${78.6569}&z=6&output=embed`)
  const [nearby, setNearby] = useState([])
  const [pincode, setPincode] = useState('110001')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handlePincodeSearch(e) {
    if (e) e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const data = await getNearbyMandis(pincode)
      if (data.success && data.mandis && data.mandis.length > 0) {
        setNearby(data.mandis)
        // Set coordinates to show on map if the mandi has coords or hardcode some center based on pincode
        let lat = 28.6667, lon = 77.2167
        if (pincode === '400001') { lat = 18.9220; lon = 72.8346 }
        if (pincode === '452001') { lat = 22.7196; lon = 75.8577 }
        if (pincode === '132001') { lat = 29.6857; lon = 76.9905 }
        setCoords({ lat, lon })
        setMapSrc(`https://www.google.com/maps?q=${lat},${lon}&z=12&output=embed`)
      } else {
        setErrorMsg('No mandis found for this pincode.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to Mandi API.')
    } finally {
      setLoading(false)
    }
  }

  function handlePhoto(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setPhoto(URL.createObjectURL(f))
  }

  function useMyLocation() {
    if (!navigator.geolocation) return alert('Geolocation not available')
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setCoords({ lat, lon })
      setMapSrc(`https://www.google.com/maps?q=${lat},${lon}&z=12&output=embed`)
      // compute simple nearby mandis (mock: within 5 degrees)
      const found = SAMPLE_MANDIS.filter(m => Math.abs(m.lat - lat) <= 5 && Math.abs(m.lon - lon) <= 5)
      setNearby(found)
      // persist search
      try {
        const raw = localStorage.getItem('nearby_searches')
        const list = raw ? JSON.parse(raw) : []
        const rec = { id: Date.now(), coords: { lat, lon }, results: found, createdAt: new Date().toISOString() }
        list.unshift(rec)
        localStorage.setItem('nearby_searches', JSON.stringify(list.slice(0, 50)))
      } catch (e) {
        console.warn('Could not save nearby search', e)
      }
    }, err => alert('Unable to get location: ' + err.message))
  }

  // history of nearby searches
  const [searchHistory, setSearchHistory] = React.useState(() => {
    try { const raw = localStorage.getItem('nearby_searches'); return raw ? JSON.parse(raw) : [] } catch { return [] }
  })

  React.useEffect(() => {
    function onStorage() { try { const raw = localStorage.getItem('nearby_searches'); setSearchHistory(raw ? JSON.parse(raw) : []) } catch {} }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function addToCart(mandi) {
    const item = {
      id: Date.now(),
      title: mandi ? `Mandi: ${mandi.name}` : 'Nearby Mandi Report',
      mandi: mandi || null,
      photo: photo || null,
      location: coords,
      createdAt: new Date().toISOString()
    }
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    cart.push(item)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart')
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>📍 Nearby Mandi Finder</h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload a farm photo or search by pincode/GPS to locate the nearest agricultural market hubs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }} className="animate-fade-in stagger-1">
        {/* Upload and location input */}
        <div className="card">
          <h3 style={{ marginBottom: 14, color: 'var(--text-primary)' }}>🔍 Find Markets</h3>
          <div className="form-group">
            <label className="form-label">Upload Farm Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ marginTop: 8 }} />
            {photo && <img src={photo} alt="preview" style={{ width: '100%', marginTop: 8, borderRadius: 12, border: '1px solid var(--border-subtle)' }} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={useMyLocation} type="button">🛰️ Use GPS Location</button>
            
            <form onSubmit={handlePincodeSearch} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Pincode (e.g. 110001)" 
                value={pincode} 
                onChange={e => setPincode(e.target.value)} 
                style={{ flex: 1 }}
                id="mandi-pincode-input"
              />
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {errorMsg && <div className="alert alert-error" style={{ marginTop: 14 }}>{errorMsg}</div>}

          <section style={{ marginTop: 20 }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Found Mandis</h4>
            {nearby.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No nearby mandis loaded. Search by GPS or Pincode.</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nearby.map(m => (
                  <div key={m.id} style={{ padding: 12, background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{m.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>State: {m.state}</div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <a href={`https://www.google.com/maps?q=${m.lat},${m.lon}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Google Maps</a>
                      <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => addToCart(m)}>Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Map Preview */}
        <div className="card">
          <h3 style={{ marginBottom: 14, color: 'var(--text-primary)' }}>🗺️ Mandi Route Map</h3>
          <div style={{ height: 320, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <iframe title="map" src={mapSrc} style={{ width: '100%', height: '100%', border: 0 }} />
          </div>
          <div style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Coordinates: {coords.lat.toFixed(5)}° N, {coords.lon.toFixed(5)}° E</div>
        </div>
      </div>

      <section style={{ marginTop: 32 }} className="animate-fade-in stagger-2">
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Search Location History</h3>
        {searchHistory.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No searches recorded yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {searchHistory.map(s => (
              <div key={s.id} style={{ padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{new Date(s.createdAt).toLocaleString()}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                    Found {s.results.length} mandis • Lat: {s.coords.lat.toFixed(3)}, Lon: {s.coords.lon.toFixed(3)}
                  </div>
                </div>
                <div>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setCoords(s.coords); setMapSrc(`https://www.google.com/maps?q=${s.coords.lat},${s.coords.lon}&z=12&output=embed`); setNearby(s.results) }}>Recall Search</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
