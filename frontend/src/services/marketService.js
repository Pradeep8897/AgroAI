import { API_BASE } from './apiConfig'

export async function getMarketPrices(crop = '') {
  const url = crop ? `${API_BASE}/market/prices?crop=${encodeURIComponent(crop)}` : `${API_BASE}/market/prices`
  const res = await fetch(url)
  return res.json()
}

export async function getPricePrediction(crop, months = 3) {
  const res = await fetch(`${API_BASE}/market/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crop, months })
  })
  return res.json()
}

export async function getNearbyMandis(pincode) {
  const res = await fetch(`${API_BASE}/market/mandis?pincode=${pincode}`)
  return res.json()
}
