import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// ... imports ...
const HomePage = () => {
  // ... logic ...
  return (
    <div className='
        flex flex-col sm:flex-row
        h-[90vh] md:h-[90vh]
        max-h-full
        w-full max-w-7xl
        rounded-2xl shadow-2xl
        overflow-hidden
        bg-gray-900/30 backdrop-blur-xl border border-white/10
      '>
      <Sidebar />
      <MessageContainer />
    </div>
  )
}
export default HomePage;