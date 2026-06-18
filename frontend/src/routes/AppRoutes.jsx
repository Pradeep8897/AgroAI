import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../App'

// Layouts
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// Landing pages
import Home from '../pages/landing/Home'
import Features from '../pages/landing/Features'
import About from '../pages/landing/About'
import Contact from '../pages/landing/Contact'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'

// App pages
import Dashboard from '../pages/Dashboard/Dashboard'
import CropRecommendation from '../pages/smartFarming/CropRecommendation'
import SoilAnalysis from '../pages/smartFarming/SoilAnalysis'
import FertilizerRecommendation from '../pages/smartFarming/FertilizerRecommendation'
import CropCalendar from '../pages/smartFarming/CropCalendar'
import UploadImage from '../pages/DiseaseDetection/UploadImage'
import DiseaseResult from '../pages/DiseaseDetection/DiseaseResult'
import Treatment from '../pages/DiseaseDetection/Treatment'
import MarketPrices from '../pages/MarketIntelligence/MarketPrices'
import DemandPrediction from '../pages/MarketIntelligence/DemandPrediction'
import NearbyMandi from '../pages/MarketIntelligence/NearbyMandi'
import Products from '../pages/Marketplace/Products'
import Cart from '../pages/Marketplace/Cart'
import Orders from '../pages/Marketplace/Orders'
import EquipmentList from '../pages/EquipmentRental/EquipmentList'
import Booking from '../pages/EquipmentRental/Booking'
import RentalHistory from '../pages/EquipmentRental/RentalHistory'
import ChatAssistant from '../pages/Assistant/ChatAssistant'
import VoiceAssistant from '../pages/Assistant/VoiceAssistant'
import CostCalculator from '../pages/ProfitOptimizer/CostCalculator'
import ProfitAnalysis from '../pages/ProfitOptimizer/ProfitAnalysis'
import RevenueEstimator from '../pages/ProfitOptimizer/RevenueEstimator'
import Profile from '../pages/Profile/Profile'
import Analytics from '../pages/Admin/Analytics'
import Users from '../pages/Admin/Users'
import AdminCrops from '../pages/Admin/Crops'
import AdminDiseases from '../pages/Admin/Diseases'
import ChatWidget from '../components/ChatWidget'
import MobileHeader from '../components/MobileHeader'
import BottomNavigation from '../components/BottomNavigation'
import ServicesHub from '../pages/landing/ServicesHub'
import Notifications from '../pages/Profile/Notifications'
import Settings from '../pages/Profile/Settings'

// Route Guard
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

// App Layout with Sidebar + Navbar (Adaptive for Mobile & Android WebView)
function AppLayout({ children }) {
  const [isMobile, setIsMobile] = React.useState(() => {
    return window.innerWidth < 768 || navigator.userAgent.includes('AgroAI-Android')
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || navigator.userAgent.includes('AgroAI-Android'))
    }
    window.addEventListener('resize', handleResize)
    // Run an immediate check to capture layout changes
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {isMobile ? <MobileHeader /> : <Navbar />}
      <div className="app-layout">
        {!isMobile && <Sidebar />}
        <main className="main-content">
          {children}
        </main>
      </div>
      {isMobile ? <BottomNavigation /> : <ChatWidget />}
    </>
  )
}

// Landing Layout without Sidebar
function LandingLayout({ children }) {
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
      <Route path="/features" element={<LandingLayout><Features /></LandingLayout>} />
      <Route path="/about" element={<LandingLayout><About /></LandingLayout>} />
      <Route path="/contact" element={<LandingLayout><Contact /></LandingLayout>} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />

      {/* Smart Farming */}
      <Route path="/crop-recommendation" element={<ProtectedRoute><AppLayout><CropRecommendation /></AppLayout></ProtectedRoute>} />
      <Route path="/soil-analysis" element={<ProtectedRoute><AppLayout><SoilAnalysis /></AppLayout></ProtectedRoute>} />
      <Route path="/fertilizer" element={<ProtectedRoute><AppLayout><FertilizerRecommendation /></AppLayout></ProtectedRoute>} />
      <Route path="/crop-calendar" element={<ProtectedRoute><AppLayout><CropCalendar /></AppLayout></ProtectedRoute>} />

      {/* Disease Detection */}
      <Route path="/disease-detect" element={<ProtectedRoute><AppLayout><UploadImage /></AppLayout></ProtectedRoute>} />
      <Route path="/disease-result" element={<ProtectedRoute><AppLayout><DiseaseResult /></AppLayout></ProtectedRoute>} />
      <Route path="/treatment" element={<ProtectedRoute><AppLayout><Treatment /></AppLayout></ProtectedRoute>} />

      {/* Market Intelligence */}
      <Route path="/market-prices" element={<ProtectedRoute><AppLayout><MarketPrices /></AppLayout></ProtectedRoute>} />
      <Route path="/demand-prediction" element={<ProtectedRoute><AppLayout><DemandPrediction /></AppLayout></ProtectedRoute>} />
      <Route path="/nearby-mandi" element={<ProtectedRoute><AppLayout><NearbyMandi /></AppLayout></ProtectedRoute>} />

      {/* Marketplace */}
      <Route path="/marketplace" element={<ProtectedRoute><AppLayout><Products /></AppLayout></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><AppLayout><Cart /></AppLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AppLayout><Orders /></AppLayout></ProtectedRoute>} />

      {/* Equipment Rental */}
      <Route path="/equipment" element={<ProtectedRoute><AppLayout><EquipmentList /></AppLayout></ProtectedRoute>} />
      <Route path="/equipment/book/:id" element={<ProtectedRoute><AppLayout><Booking /></AppLayout></ProtectedRoute>} />
      <Route path="/equipment/history" element={<ProtectedRoute><AppLayout><RentalHistory /></AppLayout></ProtectedRoute>} />

      {/* AI Assistant */}
      <Route path="/assistant" element={<ProtectedRoute><AppLayout><ChatAssistant /></AppLayout></ProtectedRoute>} />
      <Route path="/voice-assistant" element={<ProtectedRoute><AppLayout><VoiceAssistant /></AppLayout></ProtectedRoute>} />

      {/* Profit Optimizer */}
      <Route path="/cost-calculator" element={<ProtectedRoute><AppLayout><CostCalculator /></AppLayout></ProtectedRoute>} />
      <Route path="/profit-analysis" element={<ProtectedRoute><AppLayout><ProfitAnalysis /></AppLayout></ProtectedRoute>} />
      <Route path="/revenue-estimator" element={<ProtectedRoute><AppLayout><RevenueEstimator /></AppLayout></ProtectedRoute>} />

      {/* Profile & Settings & Notifications */}
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><AppLayout><ServicesHub /></AppLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AppLayout><Users /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/crops" element={<ProtectedRoute><AppLayout><AdminCrops /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/diseases" element={<ProtectedRoute><AppLayout><AdminDiseases /></AppLayout></ProtectedRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
