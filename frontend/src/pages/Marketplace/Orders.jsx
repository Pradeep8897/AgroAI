import React, { useEffect, useState } from 'react'
import { useAuth } from '../../App'
import { API_BASE } from '../../services/apiConfig'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    async function fetchOrders() {
      try {
        const uid = user?.id || 1
        const res = await fetch(`${API_BASE}/products/orders?user_id=${uid}`)
        const j = await res.json()
        if (j.success) setOrders(j.orders || [])
        else setOrders([])
      } catch (e) {
        const raw = localStorage.getItem('orders')
        setOrders(raw ? JSON.parse(raw) : [])
      }
    }
    fetchOrders()
  }, [user])

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>📦 My Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track and view your recent orders and agricultural supply deliveries.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-card)', border: '1.5px dashed var(--border-subtle)', borderRadius: 16 }} className="animate-fade-in stagger-1">
          <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.95rem' }}>No orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in stagger-1">
          {orders.map(o => (
            <div key={o.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                  🌾
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{o.product_name || `Order #${o.id}`}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>
                    Placed on {new Date(o.created_at || o.createdAt || Date.now()).toLocaleDateString(undefined, { dateStyle: 'medium' })} at {new Date(o.created_at || o.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{o.quantity}</span></div>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.1rem', marginTop: 2 }}>₹{o.total_cost}</div>
                </div>
                
                <div style={{ background: '#ecfdf5', color: '#047857', padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, border: '1px solid #a7f3d0' }}>
                  Delivered
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

