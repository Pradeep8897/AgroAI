import React, { useState } from 'react'
import { Calculator, Loader2, DollarSign, TrendingUp, AlertCircle, ArrowRight, Lightbulb, TrendingDown } from 'lucide-react'
import { API_BASE } from '../../services/apiConfig'

export default function CostCalculator() {
  const [area, setArea] = useState(1)
  const [yieldPerAcre, setYieldPerAcre] = useState(12)
  const [pricePerUnit, setPricePerUnit] = useState(1800)
  
  // Granular costs
  const [seedCost, setSeedCost] = useState(3000)
  const [fertCost, setFertCost] = useState(5000)
  const [pestCost, setPestCost] = useState(2000)
  const [laborCost, setLaborCost] = useState(8000)
  const [rentalCost, setRentalCost] = useState(4000)
  const [irrigCost, setIrrigCost] = useState(2000)
  const [otherCost, setOtherCost] = useState(1000)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCalculate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    // Expected yield = area * yieldPerAcre
    const expectedYield = Number(area) * Number(yieldPerAcre)
    
    try {
      const res = await fetch(`${API_BASE}/profit/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seed_cost: Number(seedCost),
          fertilizer_cost: Number(fertCost),
          pesticide_cost: Number(pestCost),
          labor_cost: Number(laborCost),
          rentals_cost: Number(rentalCost),
          irrigation_cost: Number(irrigCost),
          other_cost: Number(otherCost),
          expected_yield: expectedYield,
          selling_price: Number(pricePerUnit)
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Optimization computation failed.')
      }
    } catch (err) {
      console.warn("Failed to connect to backend optimizer, calculating locally", err)
      setError("Offline mode. Showing local calculations.")
      
      // Local fallback computation
      const totalCost = Number(seedCost) + Number(fertCost) + Number(pestCost) + Number(laborCost) + Number(rentalCost) + Number(irrigCost) + Number(otherCost)
      const expectedRevenue = expectedYield * Number(pricePerUnit)
      const netProfit = expectedRevenue - totalCost
      const roi = totalCost > 0 ? Number(((netProfit / totalCost) * 100).toFixed(2)) : 0

      setResult({
        success: true,
        summary: {
          total_cost: totalCost,
          expected_revenue: expectedRevenue,
          net_profit: netProfit,
          roi_percent: roi
        },
        breakdown: {
          seeds: Number(seedCost),
          fertilizers: Number(fertCost),
          pesticides: Number(pestCost),
          labor: Number(laborCost),
          rentals: Number(rentalCost),
          irrigation: Number(irrigCost),
          other: Number(otherCost)
        },
        suggestions: [
          { category: "System Offline", message: "Check backend connection to get tailored, AI-driven recommendations on labor efficiency, seed selection, and chemical treatments." }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={styles.header} className="animate-fade-in">
        <div>
          <div style={styles.badge}>PROFIT OPTIMIZER</div>
          <h1 style={{ marginTop: 8 }}>Crop Cost & Profit Calculator</h1>
          <p style={{ color: 'var(--text-muted)' }}>Optimize crop returns. Enter expected prices and itemized input costs to calculate margins and get AI suggestions.</p>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Form */}
        <div className="card animate-fade-in stagger-1">
          <h3 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--text-primary)' }}>📊 Farm & Cost Parameters</h3>
          {error && <div className="alert alert-warning" style={{ marginBottom: 16 }}>{error}</div>}
          
          <form onSubmit={handleCalculate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Land Area (acres)</label>
                <input type="number" min="0.1" step="0.1" className="form-input" value={area} onChange={e => setArea(e.target.value)} id="calc-land-area" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Yield (qt/acre)</label>
                <input type="number" min="1" className="form-input" value={yieldPerAcre} onChange={e => setYieldPerAcre(e.target.value)} id="calc-yield-acre" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Price (₹/quintal)</label>
                <input type="number" min="1" className="form-input" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} id="calc-selling-price" />
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: 12 }}>💼 Input Cost Itemization</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Seeds Cost (₹)</label>
                <input type="number" min="0" className="form-input" value={seedCost} onChange={e => setSeedCost(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Fertilizers Cost (₹)</label>
                <input type="number" min="0" className="form-input" value={fertCost} onChange={e => setFertCost(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Pesticides Cost (₹)</label>
                <input type="number" min="0" className="form-input" value={pestCost} onChange={e => setPestCost(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Labor Cost (₹)</label>
                <input type="number" min="0" className="form-input" value={laborCost} onChange={e => setLaborCost(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Equipment Rentals (₹)</label>
                <input type="number" min="0" className="form-input" value={rentalCost} onChange={e => setRentalCost(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Irrigation (₹)</label>
                <input type="number" min="0" className="form-input" value={irrigCost} onChange={e => setIrrigCost(e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Other Expenses (₹)</label>
                <input type="number" min="0" className="form-input" value={otherCost} onChange={e => setOtherCost(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} id="profit-calc-submit">
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Optimizing Budget...</> : <><Calculator size={18} /> Compute Profit Margins</>}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div className="animate-fade-in stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {result ? (
            <>
              {/* ROI & Net Profit */}
              <div className="card" style={{ border: '1px solid var(--border-active)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 14, color: 'var(--text-primary)' }}>📈 Financial Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={styles.resultItem}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Cost</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{result.summary.total_cost.toLocaleString()}</strong>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Expected Revenue</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{result.summary.expected_revenue.toLocaleString()}</strong>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Net Profit</span>
                    <strong style={{ color: result.summary.net_profit >= 0 ? 'var(--color-primary-dark)' : 'var(--color-danger)', fontSize: '1.25rem' }}>
                      ₹{result.summary.net_profit.toLocaleString()}
                    </strong>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ROI Percentage</span>
                    <strong style={{ color: result.summary.roi_percent >= 15 ? 'var(--color-primary-dark)' : 'var(--color-danger)', fontSize: '1.1rem' }}>
                      {result.summary.roi_percent}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Suggestions Panel */}
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>💡 AI Cost Optimization Advice</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.suggestions.map((sug, idx) => (
                    <div key={idx} style={{
                      padding: 14,
                      background: 'var(--color-primary-glow)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 12
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Lightbulb size={16} color="var(--color-primary-dark)" />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>{sug.category}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {sug.message}
                      </p>
                    </div>
                  ))}
                  {result.suggestions.length === 0 && (
                    <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Your costs are balanced and ROI is looking solid! No optimization recommendations needed.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={styles.placeholder}>
              <TrendingUp size={44} color="var(--text-dim)" style={{ marginBottom: 12 }} />
              <h3 style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>Calculate Margins</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Fill in the crop specifications and itemized inputs on the left to see your projected ROI and receive tailored cost-reduction advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: {
    marginBottom: 24,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--color-primary-glow)',
    border: '1px solid var(--border-default)',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--color-primary-dark)',
    marginBottom: 10,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 24,
    alignItems: 'start',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: 10,
    background: 'var(--bg-dark)',
    border: '1px solid var(--border-subtle)',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-card)',
    border: '1px dashed var(--border-subtle)',
    borderRadius: 16,
    padding: 30,
    textAlign: 'center',
    minHeight: 280,
  },
}
