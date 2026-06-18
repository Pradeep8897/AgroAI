import { API_BASE } from './apiConfig'

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  return res.json()
}

export async function getProfile(userId, token) {
  const res = await fetch(`${API_BASE}/auth/profile?user_id=${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return res.json()
}

export async function updateProfile(userId, username, email, token) {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ user_id: userId, username, email })
  })
  return res.json()
}
