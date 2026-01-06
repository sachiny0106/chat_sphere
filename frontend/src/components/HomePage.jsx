import React from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'

const HomePage = () => {
  return (
    <div className="flex flex-col sm:flex-row h-[90vh] w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden bg-base-100 border border-base-300">
      <Sidebar />
      <MessageContainer />
    </div>
  )
}
export default HomePage;