import React, { useState } from 'react'

export default function Contact() {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !message) return
    setSuccess(true)
    setMessage('')
    setEmail('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <h1>Contact AgroAI</h1>
          <p>Have a question or need help with the platform? Send us a message and our team will respond soon.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.meta}>support@agroai.com</div>
          <div style={styles.meta}>+91 98765 43210</div>
          <div style={styles.meta}>Mon - Sat, 9am - 7pm</div>
        </div>
      </div>

      {success && <div className="alert alert-success" style={{ marginBottom: 20 }}>Thank you! Your message has been sent.</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-input" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us how we can help..." />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Send Message</button>
      </form>
    </div>
  )
}

const styles = {
  page: {
    padding: 32,
    minHeight: '100vh',
    background: 'rgba(255,255,255,0.02)',
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  card: {
    background: 'rgba(15, 35, 22, 0.88)',
    border: '1px solid rgba(34,197,94,0.14)',
    borderRadius: 20,
    padding: 24,
    minWidth: 280,
  },
  meta: {
    color: '#d1fae5',
    marginBottom: 10,
    fontSize: '0.95rem',
  },
  form: {
    maxWidth: 700,
  },
}
