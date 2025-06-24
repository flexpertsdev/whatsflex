import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Grid, List } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import ContextCard from '../components/context/ContextCard'
import Button from '../components/ui/Button'
import { Heading1, Body } from '../components/ui/Typography'
import { useNavigate } from 'react-router-dom'
import { useContextStore } from '../stores/contextStore'
import { useAppStore } from '../stores/appStore'
import type { ContextCategory } from '../services/appwrite/database'

const NexusContexts: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<ContextCategory | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  const { user } = useAppStore()
  const {
    contexts,
    loadingContexts,
    error,
    loadContexts,
    createContext,
    toggleFavorite,
    clearError
  } = useContextStore()
  
  // Load contexts on mount
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    loadContexts(user.id)
  }, [user])

  const categories: ContextCategory[] = ['knowledge', 'document', 'chat', 'code', 'custom']
  
  const filteredContexts = contexts.filter(context => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = context.title.toLowerCase().includes(query) ||
                         context.content.toLowerCase().includes(query) ||
                         context.tags.some(tag => tag.toLowerCase().includes(query))
    const matchesCategory = !selectedCategory || context.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateContext = async () => {
    if (!user) return
    
    try {
      const newContext = await createContext({
        userId: user.id,
        title: 'New Context',
        content: '',
        category: 'documentation',
        tags: [],
        isFavorite: false,
        metadata: {},
        usageCount: 0
      })
      navigate(`/contexts/${newContext.$id}`)
    } catch (error) {
      console.error('Failed to create context:', error)
    }
  }

  const handleContextClick = (contextId: string) => {
    navigate(`/contexts/${contextId}`)
  }

  const handleToggleFavorite = (contextId: string) => {
    toggleFavorite(contextId)
  }

  // Show loading state
  if (loadingContexts) {
    return (
      <AdaptiveLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contexts...</p>
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
                if (user) loadContexts(user.id)
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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Heading1>Context Library</Heading1>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateContext}
            >
              New Context
            </Button>
          </div>
          <Body color="secondary">
            {filteredContexts.length} contexts available
          </Body>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contexts..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
            >
              Filter
            </Button>
            
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Category Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Contexts Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-3'
          }
        >
          {filteredContexts.map((context, index) => (
            <motion.div
              key={context.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <ContextCard
                context={{
                  id: context.$id,
                  title: context.title,
                  content: context.content,
                  category: context.category,
                  tags: context.tags,
                  createdAt: new Date(context.$createdAt),
                  updatedAt: new Date(context.$updatedAt),
                  isFavorite: context.isFavorite,
                  wordCount: context.content.split(/\s+/).length
                }}
                onClick={() => handleContextClick(context.$id)}
                onFavorite={() => handleToggleFavorite(context.$id)}
                variant={viewMode === 'list' ? 'detailed' : 'compact'}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredContexts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Body color="secondary">No contexts found matching your search.</Body>
          </motion.div>
        )}
      </div>
    </AdaptiveLayout>
  )
}

export default NexusContexts