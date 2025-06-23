import React from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'

interface TabletLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
}

const TabletLayout: React.FC<TabletLayoutProps> = ({
  children,
  onNewChat
}) => {
  return (
    <div className="flex h-dvh bg-gray-50">
      <Navigation variant="tablet" onNewChat={onNewChat} />
      
      <motion.main 
        className="flex-1 overflow-y-auto ml-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto max-w-4xl">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

export default TabletLayout