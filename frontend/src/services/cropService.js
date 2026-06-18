import { API_BASE } from './apiConfig'

export async function getCropRecommendation(params) {
  const res = await fetch(`${API_BASE}/crop/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return res.json()
}

export async function getFertilizerRecommendation(params) {
  const res = await fetch(`${API_BASE}/crop/fertilizer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return res.json()
}

export async function getCropCalendar(crop, plantingDate) {
  const res = await fetch(`${API_BASE}/crop/calendar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crop, planting_date: plantingDate })
  })
  return res.json()
}

export async function getCropHistory(userId) {
  const res = await fetch(`${API_BASE}/crop/history?user_id=${userId}`)
  return res.json()
}
