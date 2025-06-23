import React from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'

interface MobileLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
  headerTitle?: string
  onBack?: () => void
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true
}) => {
  return (
    <div className="h-dvh flex flex-col bg-gray-50">
      {showHeader && (
        <div className="pwa-header">
          <Navigation variant="mobile" />
        </div>
      )}
      
      <motion.main 
        className="flex-1 overflow-y-auto overscroll-contain scroll-smooth-mobile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={showHeader ? 'pt-header' : ''}>
          {children}
        </div>
      </motion.main>
      
      {showBottomNav && (
        <div className="pwa-bottom-nav">
          <Navigation variant="mobile" />
        </div>
      )}
    </div>
  )
}

export default MobileLayout