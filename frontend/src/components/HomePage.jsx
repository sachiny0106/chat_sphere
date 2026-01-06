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
        h-full sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]
        max-h-[700px] sm:max-h-[650px] md:max-h-[750px]
        w-full max-w-6xl
        rounded-xl shadow-2xl
        overflow-hidden
        bg-white/10 backdrop-blur-lg border border-white/20
      '>
      <Sidebar />
      <MessageContainer />
    </div>
  )
}
export default HomePage;