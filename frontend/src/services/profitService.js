import { API_BASE } from './apiConfig'

export async function optimizeProfit(params) {
  const res = await fetch(`${API_BASE}/profit/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return res.json()
}
