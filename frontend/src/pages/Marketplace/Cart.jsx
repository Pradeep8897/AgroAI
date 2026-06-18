import React from 'react'
import { useCart } from '../../App'
import { useAuth } from '../../App'
import { API_BASE } from '../../services/apiConfig'

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()

  async function placeOrder() {
    if (!cartItems || cartItems.length === 0) return alert('Cart is empty')
    const uid = user?.id || 1
    try {
      for (const item of cartItems) {
        const payload = { user_id: uid, product_id: item.id || item.product_id, quantity: item.quantity || 1, address: item.address || 'Farm' }
        const res = await fetch(`${API_BASE}/products/order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const j = await res.json()
        if (!res.ok || !j.success) throw new Error(j.message || 'Order failed')
      }
      clearCart()
      alert('Order placed successfully')
      // redirect to orders page
      window.location.href = '/orders'
    } catch (e) {
      alert('Failed to place order: ' + (e.message || e))
    }
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>🛒 Shopping Cart</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review your selected agricultural supplies and checkout to arrange delivery.</p>
      </div>

      {(!cartItems || cartItems.length === 0) ? (
        <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-card)', border: '1.5px dashed var(--border-subtle)', borderRadius: 16 }} className="animate-fade-in stagger-1">
          <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.95rem' }}>Your shopping cart is empty.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }} className="animate-fade-in stagger-1">
          {/* Cart Items List */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 4 }}>Order Details</h3>
            {cartItems.map(item => (
              <div key={item.id} style={{ padding: 14, background: 'var(--bg-dark)', borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{item.name || item.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>Quantity: {item.quantity || 1} • ₹{item.price || 0}/unit</div>
                </div>
                <div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Place Order Checkout Info */}
          <div className="card">
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 14 }}>Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Delivery Address</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Farm / Default</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Total Items</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)} units
                </span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>Est. Total</span>
                <span style={{ color: 'var(--color-primary-dark)' }}>
                  ₹{cartItems.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0).toLocaleString()}
                </span>
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={placeOrder} id="place-order-submit">Place Order</button>
          </div>
        </div>
      )}
    </div>
  )
}
