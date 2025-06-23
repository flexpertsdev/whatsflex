import React from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'

interface DesktopLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
  showSidebar?: boolean
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  onNewChat,
  showSidebar = true
}) => {
  return (
    <div className="flex h-dvh bg-gray-50">
      {showSidebar && (
        <div className="w-64 xl:w-80 border-r bg-white">
          <Navigation variant="desktop" onNewChat={onNewChat} />
        </div>
      )}
      
      <motion.main 
        className="flex-1 overflow-y-auto overscroll-contain"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto max-w-6xl p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

export default DesktopLayout