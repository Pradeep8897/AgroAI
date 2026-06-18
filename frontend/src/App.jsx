import React, { createContext, useContext, useState } from 'react'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

// ---- Auth Context ----
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('agroai_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('agroai_token') || null)

  const login = (userData, tokenStr) => {
    setUser(userData)
    setToken(tokenStr)
    localStorage.setItem('agroai_user', JSON.stringify(userData))
    localStorage.setItem('agroai_token', tokenStr)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('agroai_user')
    localStorage.removeItem('agroai_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// ---- Cart Context ----
export const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId))
  }

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity: qty } : i))
    }
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // persist cart to localStorage whenever it changes
  React.useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cartItems)) } catch {}
  }, [cartItems])

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

// ---- App Root ----
export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  )
}
