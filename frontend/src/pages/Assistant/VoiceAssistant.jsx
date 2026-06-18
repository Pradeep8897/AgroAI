import React, { useState } from 'react'
import { Mic, MicOff, Activity } from 'lucide-react'

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false)
  const [notes, setNotes] = useState(['Ask me about crop selection, disease care, or market prices.'])

  const handleMic = () => {
    setListening(!listening)
    if (!listening) {
      setNotes(prev => [...prev, 'Listening... Please speak clearly into your device.'])
    } else {
      setNotes(prev => [...prev, 'Voice capture paused.'])
    }
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <span style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--color-primary-glow)',
          border: '1px solid var(--border-default)',
          borderRadius: 999,
          padding: '6px 14px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-primary-dark)',
          marginBottom: 14,
        }}>
          🎤 VOICE ASSISTANT
        </span>
        <h1>Talk to AgroAI</h1>
        <p style={{ color: 'var(--text-muted)' }}>Use voice commands to ask for crop guidance, disease help, or market insights.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }} className="animate-fade-in stagger-1">
        {/* Activity Logs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
            <Activity size={18} color="var(--color-primary-dark)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Recent Voice Activity</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notes.map((note, idx) => (
              <p key={idx} style={{ 
                margin: 0, 
                padding: '10px 14px', 
                background: note.startsWith('Listening') 
                  ? 'var(--color-primary-glow)' 
                  : (note.startsWith('Voice') ? '#fef3c7' : 'var(--bg-dark)'),
                color: note.startsWith('Listening')
                  ? 'var(--color-primary-dark)'
                  : (note.startsWith('Voice') ? '#b45309' : 'var(--text-secondary)'),
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                fontSize: '0.9rem',
                lineHeight: 1.5,
                fontWeight: note.startsWith('Listening') || note.startsWith('Voice') ? 600 : 400
              }}>
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* Controls / Microphone interface */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyCentert: 'center', alignItems: 'center', gap: 24, textAlign: 'center', padding: 32 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
            {listening && (
              <>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--color-primary-glow)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                }} />
                <div style={{
                  position: 'absolute',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.15)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  animationDelay: '0.5s',
                }} />
              </>
            )}
            <button 
              onClick={handleMic} 
              id="voice-assistant-toggle"
              style={{
                zIndex: 2,
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: listening ? 'var(--color-danger)' : 'var(--gradient-primary)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: listening 
                  ? '0 6px 20px rgba(239, 68, 68, 0.4)' 
                  : '0 6px 20px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              {listening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              {listening ? 'I am listening...' : 'Ready to listen'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 220, margin: 0 }}>
              {listening ? 'Tap the button to finish speaking.' : 'Tap the microphone to start speaking your question.'}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-dark)',
            borderRadius: 16,
            padding: 16,
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            textAlign: 'left',
            width: '100%',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>💡 Try saying:</strong>
            “Which crop grows best in high nitrogen soil?” or “Show me tomato disease diagnostic report.”
          </div>
        </div>
      </div>
    </div>
  )
}

