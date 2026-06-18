import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Sprout, Bug, TrendingUp, ShoppingBag, Tractor, 
  MessageCircle, Calculator, HelpCircle, ArrowRight, Mic,
  Calendar, Layers, FileSpreadsheet, MapPin
} from 'lucide-react'

const SERVICE_CATEGORIES = [
  {
    title: '🌾 Smart Farming',
    desc: 'Precision agriculture powered by NPK data & soil analytics',
    color: '#22c55e',
    items: [
      { label: 'Crop Recommendation', desc: 'Predict best crops for your soil', path: '/crop-recommendation', icon: Sprout },
    ]
  },
  {
    title: '🦠 Disease Detection',
    desc: 'Instant crop leaf diagnosis & organic treatments',
    color: '#ef4444',
    items: [
      { label: 'Scan Infected Leaf', desc: 'Take photo for AI diagnosis', path: '/disease-detect', icon: Bug },
      { label: 'Treatment Library', desc: 'Find organic & chemical cures', path: '/treatment', icon: HelpCircle },
    ]
  },
  {
    title: '📈 Market Intelligence',
    desc: 'Live Mandi pricing and machine learning demand analysis',
    color: '#3b82f6',
    items: [
      { label: 'Live Market Prices', desc: 'Check daily rates across Mandis', path: '/market-prices', icon: TrendingUp },
      { label: 'Demand Prediction', desc: 'AI forecasts for maximum margins', path: '/demand-prediction', icon: FileSpreadsheet },
      { label: 'Nearby Mandis', desc: 'Find local government markets', path: '/nearby-mandi', icon: MapPin },
    ]
  },
  {
    title: '🛍️ Farm Marketplace',
    desc: 'Purchase inputs and rent high-tech tractors/machinery',
    color: '#f59e0b',
    items: [
      { label: 'Browse Store', desc: 'Seeds, pesticides & fertilizers', path: '/marketplace', icon: ShoppingBag },
      { label: 'Rent Equipment', desc: 'Rent tractors & harvesters by hour', path: '/equipment', icon: Tractor },
    ]
  },
  {
    title: '🤖 AI Assistants',
    desc: 'Natural language crop assistance at your fingertips',
    color: '#10b981',
    items: [
      { label: 'Chat Assistant', desc: 'Chat with our advanced agriculture AI', path: '/assistant', icon: MessageCircle },
      { label: 'Voice Assistant', desc: 'Ask questions in local languages', path: '/voice-assistant', icon: Mic },
    ]
  },
  {
    title: '📊 Profit Optimizer',
    desc: 'Budgeting calculators and revenue estimates for crops',
    color: '#8b5cf6',
    items: [
      { label: 'Cost Calculator', desc: 'Track seed, water & labor costs', path: '/cost-calculator', icon: Calculator },
      { label: 'Profit Analysis', desc: 'Estimate net profit margins', path: '/profit-analysis', icon: TrendingUp },
    ]
  }
]

export default function ServicesHub() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div className="page-header">
        <h1>🌾 AgroAI Services</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select a smart farming tool or resource to launch it.</p>
      </div>

      {/* Grid of Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {SERVICE_CATEGORIES.map((cat, idx) => (
          <div key={cat.title} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
            {/* Category Header */}
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {cat.title}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.desc}</p>
            </div>

            {/* Category Items Grid */}
            <div className="grid-2" style={{ gap: 14 }}>
              {cat.items.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 14, 
                    padding: '14px 16px',
                    textDecoration: 'none',
                    background: 'var(--bg-card)',
                    borderRadius: 12,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Icon Wrapper */}
                  <div style={{ 
                    background: `${cat.color}15`, 
                    border: `1px solid ${cat.color}30`,
                    borderRadius: 10,
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <item.icon size={20} color={cat.color} />
                  </div>

                  {/* Text Description */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.desc}
                    </div>
                  </div>

                  {/* Action Arrow */}
                  <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

