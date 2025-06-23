import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import ChatHeader from '../components/chat/ChatHeader'
import MessageBubble from '../components/chat/MessageBubble'
import MessageComposer from '../components/chat/MessageComposer'
import ContextSelector from '../components/context/ContextSelector'
import ContextBottomSheet from '../components/context/ContextBottomSheet'
import { AnimatePresence, motion } from 'framer-motion'
import { Library, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import { useChatStore } from '../stores/chatStore'
import { useContextStore } from '../stores/contextStore'
import { useAppStore } from '../stores/appStore'
import type { Message } from '../components/chat/MessageBubble'
import type { Context } from '../components/context/ContextSelector'

const NexusChat: React.FC = () => {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [isThinking, setIsThinking] = useState(false)
  const [showContextSelector, setShowContextSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get store states and actions
  const { user } = useAppStore()
  const { 
    currentChat, 
    messages: chatMessages,
    loadingMessages,
    sendingMessage,
    error: chatError,
    selectChat,
    createChat,
    sendMessage,
    subscribeToCurrentChat,
    unsubscribeFromCurrentChat,
    clearError: clearChatError
  } = useChatStore()
  
  const {
    contexts,
    selectedContexts,
    loadingContexts,
    error: contextError,
    loadContexts,
    toggleContext,
    clearSelection,
    clearError: clearContextError
  } = useContextStore()
  
  // Map contexts to UI format
  const uiContexts: Context[] = contexts.map(ctx => ({
    id: ctx.$id,
    title: ctx.title,
    category: ctx.category,
    tags: ctx.tags
  }))
  
  // Get messages for current chat
  const messages: Message[] = currentChat ? (chatMessages[currentChat.$id] || []).map(msg => ({
    id: msg.$id,
    content: msg.content,
    sender: msg.role as 'user' | 'ai',
    timestamp: new Date(msg.createdAt),
    status: msg.status
  })) : []

  // Initialize chat on mount
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    const initializeChat = async () => {
      if (chatId === 'new') {
        // Create new chat
        const newChat = await createChat(user.id, 'New Chat', selectedContexts)
        navigate(`/chats/${newChat.$id}`, { replace: true })
      } else if (chatId) {
        // Load existing chat
        await selectChat(chatId)
      }
    }
    
    initializeChat()
    
    // Cleanup on unmount
    return () => {
      unsubscribeFromCurrentChat()
    }
  }, [chatId, user])
  
  // Load contexts on mount
  useEffect(() => {
    if (user) {
      loadContexts(user.id)
    }
  }, [user])
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (currentChat) {
      subscribeToCurrentChat()
    }
  }, [currentChat?.$id])
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentChat) return
    
    try {
      setIsThinking(true)
      await sendMessage(content, attachments)
      
      // TODO: In Phase 3, we'll trigger AI response here
      // For now, simulate AI thinking
      setTimeout(() => {
        setIsThinking(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsThinking(false)
    }
  }

  const handleToggleContext = (contextId: string) => {
    toggleContext(contextId)
    
    // Update chat with new context selection
    if (currentChat) {
      const { updateChat } = useChatStore.getState()
      updateChat(currentChat.$id, { contextIds: selectedContexts })
    }
  }
  
  // Show loading state
  if (loadingMessages || loadingContexts) {
    return (
      <AdaptiveLayout 
        mobileProps={{ showHeader: false, showBottomNav: false }}
        desktopProps={{ showSidebar: true }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </AdaptiveLayout>
    )
  }
  
  // Show error state
  if (chatError || contextError) {
    return (
      <AdaptiveLayout 
        mobileProps={{ showHeader: false, showBottomNav: false }}
        desktopProps={{ showSidebar: true }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{chatError || contextError}</p>
            <Button 
              variant="secondary" 
              onClick={() => {
                clearChatError()
                clearContextError()
                navigate('/chats')
              }}
            >
              Back to Chats
            </Button>
          </div>
        </div>
      </AdaptiveLayout>
    )
  }

  return (
    <AdaptiveLayout 
      mobileProps={{ 
        showHeader: false, 
        showBottomNav: false 
      }}
      desktopProps={{
        showSidebar: true
      }}
    >
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          <ChatHeader
            title={currentChat?.name || 'New Chat'}
            subtitle={selectedContexts.length > 0 ? `${selectedContexts.length} contexts selected` : 'No contexts selected'}
            onBack={() => navigate('/chats')}
            onMenuClick={() => setShowContextSelector(!showContextSelector)}
          />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a new conversation
                </h3>
                <p className="text-gray-600 mb-6">
                  Select contexts to enhance AI responses
                </p>
                <Button
                  variant="secondary"
                  icon={<Library className="w-4 h-4" />}
                  onClick={() => setShowContextSelector(true)}
                >
                  Select Contexts
                </Button>
              </motion.div>
            )}

            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={true}
                  isGrouped={false}
                />
              ))}
              
              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <MessageBubble
                      message={{
                        id: 'thinking',
                        content: '',
                        sender: 'ai',
                        timestamp: new Date()
                      }}
                      showAvatar={true}
                      isGrouped={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Context Bar */}
          {selectedContexts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border-t border-gray-200 bg-white px-4 py-2"
            >
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-sm text-gray-600 flex-shrink-0">Contexts:</span>
                {selectedContexts.map(contextId => {
                  const context = uiContexts.find(c => c.id === contextId)
                  return context ? (
                    <span
                      key={contextId}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex-shrink-0"
                    >
                      {context.title}
                    </span>
                  ) : null
                })}
                <button
                  onClick={() => setShowContextSelector(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex-shrink-0"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          )}

          {/* Message Composer */}
          <MessageComposer
            onSendMessage={handleSendMessage}
            placeholder="Type your message..."
            disabled={isThinking || sendingMessage || !currentChat}
          />
        </div>

        {/* Desktop Context Selector Sidebar */}
        <AnimatePresence>
          {showContextSelector && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:block border-l border-gray-200 bg-white overflow-hidden"
            >
              <div className="h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Select Contexts</h3>
                  <button
                    onClick={() => setShowContextSelector(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <ContextSelector
                  contexts={uiContexts}
                  selectedContexts={selectedContexts}
                  onToggleContext={handleToggleContext}
                  onClearAll={clearSelection}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Context Bottom Sheet */}
      <ContextBottomSheet
        isOpen={showContextSelector}
        onClose={() => setShowContextSelector(false)}
        contexts={uiContexts}
        selectedContexts={selectedContexts}
        onToggleContext={handleToggleContext}
        onClearAll={clearSelection}
      />
    </AdaptiveLayout>
  )
}

export default NexusChat