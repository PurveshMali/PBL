import React from 'react'
import { Routes, Route } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage'
import SideBar from './components/common/Sidebar'
import PowerPlantInsights from './pages/PowerPlantInsights'
import ImpactPage from './pages/ImpactPage'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'

const App = () => {
  console.log("object")
  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>

    
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
      <div className="absolute inset-0 backdrop-blur-sm" />

    </div>

    <SideBar />
      <Routes>
        <Route path='/home' element={<LandingPage />} />
        <Route path='/' element={<OverviewPage />} />
        <Route path='/insights' element={<PowerPlantInsights />} />
        <Route path='/impacts' element={<ImpactPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
    </div>
  )
}

export default App
