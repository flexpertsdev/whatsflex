import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, MessageSquare } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Heading1, Body, Caption } from '../components/ui/Typography'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '../stores/chatStore'
import { useAppStore } from '../stores/appStore'

const NexusChatList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  
  const { user } = useAppStore()
  const { 
    chats, 
    loadingChats, 
    error,
    loadChats,
    subscribeToUserChats,
    unsubscribeFromUserChats,
    clearError
  } = useChatStore()
  
  // Load chats on mount
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    loadChats(user.id)
    subscribeToUserChats(user.id)
    
    return () => {
      unsubscribeFromUserChats()
    }
  }, [user])

  const filteredChats = chats.filter(chat => {
    const query = searchQuery.toLowerCase()
    const title = chat.name.toLowerCase()
    const lastMessage = chat.lastMessage?.toLowerCase() || ''
    return title.includes(query) || lastMessage.includes(query)
  })

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Show loading state
  if (loadingChats) {
    return (
      <AdaptiveLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chats...</p>
          </div>
        </div>
      </AdaptiveLayout>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <AdaptiveLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              variant="secondary" 
              onClick={() => {
                clearError()
                if (user) loadChats(user.id)
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </AdaptiveLayout>
    )
  }
  
  return (
    <AdaptiveLayout onNewChat={() => navigate('/chats/new')}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Heading1>Chats</Heading1>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/chats/new')}
            >
              New Chat
            </Button>
          </div>
          <Body color="secondary">
            {filteredChats.length} conversations
          </Body>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card
                hoverable
                onClick={() => navigate(`/chats/${chat.$id}`)}
                padding="md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      {chat.unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <Caption className="line-clamp-1 mb-2">
                      {chat.lastMessage || 'No messages yet'}
                    </Caption>
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <Caption>{chat.messageCount} messages</Caption>
                      </div>
                      {chat.contextIds.length > 0 && (
                        <Caption>{chat.contextIds.length} contexts</Caption>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Caption className="flex-shrink-0">
                      {formatTimestamp(new Date(chat.lastMessageAt))}
                    </Caption>
                    {chat.archived && (
                      <Caption className="text-gray-400">Archived</Caption>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredChats.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <Body color="secondary">No chats found</Body>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/chats/new')}
            >
              Start a New Chat
            </Button>
          </motion.div>
        )}
      </div>
    </AdaptiveLayout>
  )
}

export default NexusChatList