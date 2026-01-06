import React from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'

const HomePage = () => {
  return (
    <div className="flex flex-col sm:flex-row h-[90vh] w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden bg-base-100/90 border border-base-300 backdrop-blur-sm">
      <Sidebar />
      <MessageContainer />
    </div>
  )
}
export default HomePage;