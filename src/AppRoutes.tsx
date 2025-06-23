import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './stores/appStore'
import AuthGuard from './components/auth/AuthGuard'
import LoadingScreen from './components/ui/LoadingScreen'

// Auth pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'

// Protected pages
import Onboarding from './pages/Onboarding'
import NexusHome from './pages/NexusHome'
import NexusChat from './pages/NexusChat'
import NexusChatList from './pages/NexusChatList'
import NexusContexts from './pages/NexusContexts'
import NexusContextDetails from './pages/NexusContextDetails'
import NexusInsights from './pages/NexusInsights'
import NexusSettings from './pages/NexusSettings'
import NexusProfile from './pages/NexusProfile'
import Showcase from './pages/Showcase'
import Setup from './pages/Setup'

const AppRoutes: React.FC = () => {
  const { authState, initAuth } = useAppStore()

  useEffect(() => {
    // Initialize auth state on app load
    initAuth()
  }, [initAuth])

  if (authState === 'loading') {
    return <LoadingScreen />
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        authState === 'authenticated' ? <Navigate to="/" replace /> : <Login />
      } />
      <Route path="/register" element={
        authState === 'authenticated' ? <Navigate to="/" replace /> : <Register />
      } />
      <Route path="/forgot-password" element={
        authState === 'authenticated' ? <Navigate to="/" replace /> : <ForgotPassword />
      } />

      {/* Protected routes */}
      <Route path="/onboarding" element={
        <AuthGuard>
          <Onboarding />
        </AuthGuard>
      } />
      <Route path="/" element={
        <AuthGuard>
          <NexusHome />
        </AuthGuard>
      } />
      <Route path="/showcase" element={
        <AuthGuard>
          <Showcase />
        </AuthGuard>
      } />
      <Route path="/setup" element={
        <AuthGuard>
          <Setup />
        </AuthGuard>
      } />
      <Route path="/chats" element={
        <AuthGuard>
          <NexusChatList />
        </AuthGuard>
      } />
      <Route path="/chats/new" element={
        <AuthGuard>
          <NexusChat />
        </AuthGuard>
      } />
      <Route path="/chats/:chatId" element={
        <AuthGuard>
          <NexusChat />
        </AuthGuard>
      } />
      <Route path="/contexts" element={
        <AuthGuard>
          <NexusContexts />
        </AuthGuard>
      } />
      <Route path="/contexts/new" element={
        <AuthGuard>
          <div>Create Context</div>
        </AuthGuard>
      } />
      <Route path="/contexts/:contextId" element={
        <AuthGuard>
          <NexusContextDetails />
        </AuthGuard>
      } />
      <Route path="/insights" element={
        <AuthGuard>
          <NexusInsights />
        </AuthGuard>
      } />
      <Route path="/settings" element={
        <AuthGuard>
          <NexusSettings />
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <NexusProfile />
        </AuthGuard>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes