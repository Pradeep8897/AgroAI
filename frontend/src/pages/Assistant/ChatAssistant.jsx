import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, RefreshCw } from 'lucide-react'
import { sendMessage } from '../../services/assistantService'

const SUGGESTIONS = [
  'How to improve soil health?',
  'Best crop for sandy soil?',
  'Tomato blight treatment?',
  'Rice market prices today',
  'What is organic farming?'
]

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🌱 I am your AgroAI farming assistant. Ask me anything about crops, soil health, pest control, market prices, or general agricultural advice. I\'m here to help!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
  }

  const handleSend = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    addMessage('user', msg)
    setLoading(true)
    try {
      const data = await sendMessage(msg)
      addMessage('bot', data.reply || 'I could not process your request. Please try again.')
    } catch {
      addMessage('bot', '⚠️ Connection error. Please ensure the AgroAI backend server is running on port 5000.')
    }
    setLoading(false)
  }

  const handleClear = () => {
    setMessages([{ sender: 'bot', text: 'Chat cleared. How can I help you with farming today? 🌾', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }} className="animate-fade-in">
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>🤖 AI Farm Assistant</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ask farming questions in natural language. Available 24/7.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleClear} id="clear-chat-btn" style={{ padding: '8px 14px', height: 'fit-content' }}>
          <RefreshCw size={14} style={{ marginRight: 4 }} /> Clear Chat
        </button>
      </div>

      <div style={styles.chatContainer} className="animate-fade-in stagger-1">
        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16, animation: 'fadeIn 0.3s ease' }}>
              {msg.sender === 'bot' && (
                <div style={styles.botAvatar}>
                  <Bot size={16} color="var(--color-primary-dark)" />
                </div>
              )}
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  ...styles.bubble,
                  background: msg.sender === 'user'
                    ? 'var(--gradient-primary)'
                    : 'var(--bg-dark)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: msg.sender === 'bot' ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, textAlign: msg.sender === 'user' ? 'right' : 'left', paddingHorizontal: 4 }}>
                  {msg.time}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div style={styles.userAvatar}>
                  <User size={14} color="var(--color-primary-dark)" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={styles.botAvatar}><Bot size={16} color="var(--color-primary-dark)" /></div>
              <div style={{ ...styles.bubble, background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--color-primary-dark)' }}>
                <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                AgroAI is formulating expert advice...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={styles.suggestionsBox}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>💡 Try asking:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} style={styles.suggestion} onClick={() => handleSend(s)} id={`suggestion-${s.split(' ')[0]}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={styles.inputRow}>
          <input
            className="form-input"
            style={{ 
              flex: 1, 
              borderRadius: 14, 
              border: '1px solid var(--border-default)',
              padding: '12px 16px',
              outline: 'none',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
            placeholder="Ask about crops, soil, diseases, market prices..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            id="chat-assistant-input"
          />
          <button
            style={{ ...styles.sendBtn, opacity: input.trim() ? 1 : 0.6 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            id="chat-assistant-send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  chatContainer: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 20,
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 20,
  },
  botAvatar: {
    width: 32, height: 32,
    background: 'var(--color-primary-glow)',
    border: '1px solid var(--border-default)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginRight: 10, flexShrink: 0, alignSelf: 'flex-end',
  },
  userAvatar: {
    width: 32, height: 32,
    background: 'var(--color-primary-glow)',
    border: '1px solid var(--border-default)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginLeft: 10, flexShrink: 0, alignSelf: 'flex-end',
  },
  bubble: {
    padding: '12px 16px',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    boxShadow: 'var(--shadow-sm)',
  },
  suggestionsBox: {
    padding: '16px 20px',
    borderTop: '1px solid var(--border-subtle)',
    background: 'var(--bg-deep)',
  },
  suggestion: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 500,
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s ease',
  },
  inputRow: {
    display: 'flex',
    gap: 12,
    padding: 16,
    borderTop: '1px solid var(--border-subtle)',
    background: 'var(--bg-card)',
  },
  sendBtn: {
    background: 'var(--gradient-primary)',
    border: 'none',
    borderRadius: 14,
    width: 46, height: 46,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#fff', flexShrink: 0,
    boxShadow: '0 4px 10px rgba(34, 197, 94, 0.25)',
  },
}

