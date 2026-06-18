import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import { sendMessage } from '../services/assistantService'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste! 🌱 I am AgroAI assistant. Ask me about crops, soil, diseases, or market prices!' }
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || loading) return
    const userMsg = inputText.trim()
    setInputText('')
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setLoading(true)
    try {
      const data = await sendMessage(userMsg)
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || 'I could not process that request. Please try again.' }])
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Connection error. Please ensure the backend server is running.' }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        style={styles.floatBtn}
        onClick={() => setOpen(!open)}
        className="glow-pulse"
        id="chat-widget-toggle"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={styles.chatPanel} className="animate-scale-in">
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={styles.botAvatar}>
                <Bot size={18} color="#22c55e" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f0fdf4' }}>AgroAI Assistant</div>
                <div style={{ fontSize: '0.7rem', color: '#22c55e' }}>● Online</div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}><X size={16} /></button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10,
                animation: 'fadeIn 0.3s ease',
              }}>
                {msg.sender === 'bot' && (
                  <div style={styles.botAvatarSmall}><Bot size={12} /></div>
                )}
                <div style={{
                  ...styles.bubble,
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #22c55e, #10b981)'
                    : 'rgba(15, 35, 22, 0.9)',
                  color: msg.sender === 'user' ? '#fff' : '#86efac',
                  borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  border: msg.sender === 'bot' ? '1px solid rgba(34,197,94,0.15)' : 'none',
                  maxWidth: '78%',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4d7c5e', fontSize: '0.8rem' }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about crops, diseases, prices..."
              id="chat-widget-input"
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: inputText.trim() ? 1 : 0.5,
              }}
              onClick={handleSend}
              disabled={!inputText.trim() || loading}
              id="chat-widget-send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  floatBtn: {
    position: 'fixed',
    bottom: 28,
    right: 28,
    width: 56, height: 56,
    background: 'linear-gradient(135deg, #22c55e, #10b981)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
    zIndex: 1000,
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  chatPanel: {
    position: 'fixed',
    bottom: 96,
    right: 28,
    width: 340,
    height: 480,
    background: 'rgba(5, 18, 10, 0.97)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 999,
    boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 32px rgba(34,197,94,0.15)',
    backdropFilter: 'blur(20px)',
  },
  header: {
    padding: '14px 16px',
    borderBottom: '1px solid rgba(34, 197, 94, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(10, 25, 15, 0.8)',
  },
  botAvatar: {
    width: 34, height: 34,
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatarSmall: {
    width: 22, height: 22,
    background: 'rgba(34, 197, 94, 0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    flexShrink: 0,
    color: '#22c55e',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#4d7c5e',
    padding: 4,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  bubble: {
    padding: '9px 13px',
    fontSize: '0.845rem',
    lineHeight: 1.5,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  inputArea: {
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid rgba(34, 197, 94, 0.12)',
    background: 'rgba(10, 25, 15, 0.6)',
  },
  input: {
    flex: 1,
    background: 'rgba(15, 35, 22, 0.8)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: 10,
    padding: '8px 12px',
    color: '#f0fdf4',
    fontSize: '0.85rem',
    outline: 'none',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #22c55e, #10b981)',
    border: 'none',
    borderRadius: 10,
    width: 36, height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    flexShrink: 0,
  },
}
