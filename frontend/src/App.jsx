import React from 'react'
import { Routes, Route, useLocation  } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage'
import SideBar from './components/common/Sidebar'
import PowerPlantInsights from './pages/PowerPlantInsights'
import ImpactPage from './pages/ImpactPage'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'
import SplashCursor from './animations/SplashCursor'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPassword from './pages/ForgotPassword'

const App = () => {

  const location = useLocation();
  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
    
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
      <div className="absolute inset-0 backdrop-blur-sm" />

    </div>
    {/* <SplashCursor /> */}
    {location.pathname != "/" && location.pathname != "/login" && location.pathname != "/register" && location.pathname != "/forgot-password" && <SideBar />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/overview' element={<OverviewPage />} />
        <Route path='/insights' element={<PowerPlantInsights />} />
        <Route path='/impacts' element={<ImpactPage />} />
        <Route path='/settings' element={<SettingsPage />} /> 
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default App
