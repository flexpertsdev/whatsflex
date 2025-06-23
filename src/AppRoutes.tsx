import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NexusHome from './pages/NexusHome'
import NexusChat from './pages/NexusChat'
import NexusChatList from './pages/NexusChatList'
import NexusContexts from './pages/NexusContexts'
import NexusContextDetails from './pages/NexusContextDetails'
import NexusInsights from './pages/NexusInsights'
import NexusSettings from './pages/NexusSettings'
import NexusProfile from './pages/NexusProfile'
import Showcase from './pages/Showcase'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NexusHome />} />
      <Route path="/showcase" element={<Showcase />} />
      <Route path="/chats" element={<NexusChatList />} />
      <Route path="/chats/new" element={<NexusChat />} />
      <Route path="/chats/:chatId" element={<NexusChat />} />
      <Route path="/contexts" element={<NexusContexts />} />
      <Route path="/contexts/new" element={<div>Create Context</div>} />
      <Route path="/contexts/:contextId" element={<NexusContextDetails />} />
      <Route path="/insights" element={<NexusInsights />} />
      <Route path="/settings" element={<NexusSettings />} />
      <Route path="/profile" element={<NexusProfile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes