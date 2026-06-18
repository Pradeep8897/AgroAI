import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, TrendingUp, Leaf, ShoppingCart, MoreHorizontal } from 'lucide-react'

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      {/* Home */}
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        id="bottom-nav-home"
      >
        <div className="bottom-nav-icon-wrapper">
          <Home size={20} className="bottom-nav-icon" />
        </div>
        <span>Home</span>
      </NavLink>

      {/* Market */}
      <NavLink 
        to="/market-prices" 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        id="bottom-nav-market"
      >
        <div className="bottom-nav-icon-wrapper">
          <TrendingUp size={20} className="bottom-nav-icon" />
        </div>
        <span>Market</span>
      </NavLink>

      {/* Farm AI */}
      <NavLink 
        to="/crop-recommendation" 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        id="bottom-nav-farm-ai"
      >
        <div className="bottom-nav-icon-wrapper">
          <Leaf size={20} className="bottom-nav-icon" />
        </div>
        <span>Farm AI</span>
      </NavLink>

      {/* Shop */}
      <NavLink 
        to="/marketplace" 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        id="bottom-nav-shop"
      >
        <div className="bottom-nav-icon-wrapper">
          <ShoppingCart size={20} className="bottom-nav-icon" />
        </div>
        <span>Shop</span>
      </NavLink>

      {/* More */}
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        id="bottom-nav-more"
      >
        <div className="bottom-nav-icon-wrapper">
          <MoreHorizontal size={20} className="bottom-nav-icon" />
        </div>
        <span>More</span>
      </NavLink>
    </nav>
  )
}

