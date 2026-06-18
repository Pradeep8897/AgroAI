import { API_BASE } from './apiConfig'

export async function sendMessage(message) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  return res.json()
}
