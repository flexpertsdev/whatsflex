import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'

interface AdaptiveLayoutProps {
  children?: React.ReactNode
  onNewChat?: () => void | Promise<void>
  mobileProps?: {
    showHeader?: boolean
    showBottomNav?: boolean
  }
  desktopProps?: {
    showSidebar?: boolean
  }
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ 
  children,
  onNewChat,
  mobileProps = {},
  desktopProps = {}
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationProps = {
    currentPath: location.pathname,
    onNavigate: navigate,
    onNewChat,
  }

  return (
    <div className="h-dvh bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile header */}
      <div className="lg:hidden pwa-header">
        <Navigation variant="mobile" {...navigationProps} {...mobileProps} />
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 xl:w-80 border-r bg-white">
        <Navigation variant="desktop" {...navigationProps} {...desktopProps} />
      </div>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children || <Outlet />}
        </div>
      </main>
      
      {/* Mobile bottom nav */}
      <div className="lg:hidden pwa-bottom-nav">
        <Navigation variant="mobile" {...navigationProps} {...mobileProps} />
      </div>
    </div>
  )
}

export default AdaptiveLayout