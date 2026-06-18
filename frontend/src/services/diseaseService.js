import { API_BASE } from './apiConfig'

export async function detectDisease(imageFile, userId) {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('user_id', userId || 0)
  const res = await fetch(`${API_BASE}/disease/detect`, {
    method: 'POST',
    body: formData
  })
  return res.json()
}

export async function getDiseaseReports(userId) {
  const res = await fetch(`${API_BASE}/disease/reports?user_id=${userId}`)
  return res.json()
}
