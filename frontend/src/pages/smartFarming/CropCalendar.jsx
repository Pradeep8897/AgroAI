import React, { useEffect, useMemo, useState } from 'react'
import { API_BASE } from '../../services/apiConfig'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysInMonth(date) {
  const d = startOfMonth(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return d.getDate()
}

export default function Cropcalendar() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [form, setForm] = useState({ date: selectedDate, crop: '', task: '' })
  const [monthOffset, setMonthOffset] = useState(0)

  // AI Timeline generator states
  const [aiCrop, setAiCrop] = useState('Rice')
  const [aiDate, setAiDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cropCalendarEvents')
      if (raw) setEvents(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cropCalendarEvents', JSON.stringify(events))
    } catch (e) {}
  }, [events])

  const base = useMemo(() => {
    const now = new Date()
    const dt = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    return dt
  }, [monthOffset])

  const monthDays = useMemo(() => {
    const total = daysInMonth(base)
    const arr = []
    for (let i = 1; i <= total; i++) arr.push(new Date(base.getFullYear(), base.getMonth(), i))
    return arr
  }, [base])

  function addEvent(e) {
    e.preventDefault()
    if (!form.crop || !form.task) return alert('Please fill in both crop and task fields.')
    const ev = { id: Date.now(), date: form.date, crop: form.crop, task: form.task }
    setEvents(prev => [ev, ...prev])
    setForm({ date: form.date, crop: '', task: '' })
  }

  async function generateAiTimeline(e) {
    e.preventDefault()
    setGenerating(true)
    setAiError('')
    try {
      const res = await fetch(`${API_BASE}/crop/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: aiCrop, planting_date: aiDate })
      })
      const j = await res.json()
      if (j.success && j.timeline) {
        const newEvents = j.timeline.map(stage => ({
          id: Date.now() + Math.random(),
          date: stage.start_date,
          crop: j.crop,
          task: `[Stage ${stage.stage_number}] ${stage.phase}: ${stage.activity}`
        }))
        setEvents(prev => [...newEvents, ...prev])
        alert(`Successfully generated ${j.timeline.length} growth stages for ${j.crop}!`)
      } else {
        setAiError(j.message || 'Timeline generation failed.')
      }
    } catch (err) {
      console.error(err)
      setAiError('AI calendar endpoint failed. Ensure the Flask server is running.')
    } finally {
      setGenerating(false)
    }
  }

  function removeEvent(id) {
    setEvents(prev => prev.filter(p => p.id !== id))
  }

  const eventsByDate = useMemo(() => {
    const map = {}
    for (const ev of events) {
      map[ev.date] = map[ev.date] || []
      map[ev.date].push(ev)
    }
    return map
  }, [events])

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>🗓️ Crop Calendar</h1>
        <p>Schedule crop tasks manually or use AI to generate complete crop lifecycle schedules automatically.</p>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in stagger-1">
          {/* Manual event creation */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>✍️ Schedule Task Manually</h3>
            <form onSubmit={addEvent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
                Target Date
                <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
                Crop Name
                <input className="form-input" value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))} placeholder="e.g. Tomato" style={{ width: '100%' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
                Task Description
                <input className="form-input" value={form.task} onChange={e => setForm(f => ({ ...f, task: e.target.value }))} placeholder="e.g. Apply NPK Fertilizer" style={{ width: '100%' }} />
              </label>
              <div>
                <button className="btn btn-primary btn-block" type="submit">Add Manual Event</button>
              </div>
            </form>
          </div>

          {/* AI Timeline Generation */}
          <div className="card" style={{ background: 'var(--color-primary-glow)', border: '1px solid var(--border-default)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>🤖 AI Growth Timeline</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 14 }}>
              Select a crop and sowing date to generate a complete growth cycle schedule automatically.
            </p>
            {aiError && <div className="alert alert-error" style={{ padding: '8px 10px', fontSize: '0.78rem', marginBottom: 10 }}>{aiError}</div>}
            <form onSubmit={generateAiTimeline} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
                Crop Name
                <select className="form-select" value={aiCrop} onChange={e => setAiCrop(e.target.value)} style={{ width: '100%' }}>
                  <option value="Rice">Rice (Kharif)</option>
                  <option value="Wheat">Wheat (Rabi)</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Maize">Maize (Corn)</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Coffee">Coffee</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="form-label">
                Sowing/Planting Date
                <input type="date" className="form-input" value={aiDate} onChange={e => setAiDate(e.target.value)} style={{ width: '100%' }} />
              </label>
              <button className="btn btn-success btn-block" type="submit" disabled={generating} id="ai-calendar-generate">
                {generating ? 'Generating Cycle...' : 'Generate AI Calendar'}
              </button>
            </form>
          </div>

          <section className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>Upcoming Schedule</h3>
            {events.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No events scheduled.</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {events.slice(0, 10).map(ev => (
                  <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10, background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                    <div style={{ flex: 1, paddingRight: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{ev.crop} • <span style={{ color: 'var(--color-primary-dark)' }}>{ev.date}</span></div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 3, lineHeight: 1.3 }}>{ev.task}</div>
                    </div>
                    <div>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px' }} onClick={() => removeEvent(ev.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div style={{ flex: 1, minWidth: 360 }} className="card animate-fade-in stagger-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setMonthOffset(m => m - 1)}>◀</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setMonthOffset(0)}>Today</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setMonthOffset(m => m + 1)}>▶</button>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{base.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
            <div />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 16 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d}</div>)}

            {monthDays.map(dt => {
              const iso = dt.toISOString().slice(0,10)
              const dayEvents = eventsByDate[iso] || []
              const isToday = new Date().toISOString().slice(0,10) === iso
              const isSelected = selectedDate === iso
              return (
                <div key={iso} onClick={() => setSelectedDate(iso)} style={{
                  padding: 8,
                  minHeight: 88,
                  background: isSelected ? 'rgba(34,197,94,0.08)' : 'var(--bg-surface)',
                  border: isToday ? '2px solid var(--color-primary)' : isSelected ? '1.5px solid var(--color-primary-dark)' : '1px solid var(--border-default)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isToday ? 'var(--color-primary-dark)' : 'var(--text-primary)', marginBottom: 4 }}>{dt.getDate()}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {dayEvents.slice(0,2).map(ev => (
                      <div key={ev.id} style={{ fontSize: '0.68rem', color: 'var(--color-primary-dark)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', margin: '2px 0', fontWeight: 500 }}>
                        {ev.crop}: {ev.task.replace(/\[Stage \d+\]\s*/, '')}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>+{dayEvents.length - 2} more</div>}
                  </div>
                </div>
              )
            })}
          </div>

          <section style={{ marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>Schedule details for {selectedDate}</h3>
            {(eventsByDate[selectedDate] || []).length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No activities scheduled on this date.</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {eventsByDate[selectedDate].map(ev => (
                  <div key={ev.id} style={{ padding: 12, background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ev.crop}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4, lineHeight: 1.4 }}>{ev.task}</div>
                    </div>
                    <div>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeEvent(ev.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
