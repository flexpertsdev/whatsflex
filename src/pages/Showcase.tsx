import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'

// Component imports
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Heading1, Heading2, Heading3, Body, Caption } from '../components/ui/Typography'
import MessageBubble from '../components/chat/MessageBubble'
import MessageComposer from '../components/chat/MessageComposer'
import ContextCard from '../components/context/ContextCard'
import ContextSelector from '../components/context/ContextSelector'
import AIInsightsPanel from '../components/ai/AIInsightsPanel'
import ThinkingIndicator from '../components/ai/ThinkingIndicator'

const Showcase: React.FC = () => {
  return (
    <AdaptiveLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Heading1 className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
              Nexus Component Showcase
            </Heading1>
            <Body className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive showcase of all components in the Nexus UI system.
              These components form the foundation of our modern chat experience.
            </Body>
          </motion.div>

          {/* Foundation Components */}
          <section className="space-y-6">
            <Heading2>Foundation Components</Heading2>
            
            <Card className="p-6">
              <Heading3 className="mb-4">Buttons</Heading3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </Card>

            <Card className="p-6">
              <Heading3 className="mb-4">Typography</Heading3>
              <div className="space-y-4">
                <Heading1>Heading 1 - Main Title</Heading1>
                <Heading2>Heading 2 - Section Title</Heading2>
                <Heading3>Heading 3 - Subsection</Heading3>
                <Body>Body text - Regular paragraph content that can span multiple lines and provides detailed information to users.</Body>
                <Caption className="text-gray-600">Caption - Small helper text</Caption>
              </div>
            </Card>
          </section>

          {/* Chat Components */}
          <section className="space-y-6">
            <Heading2>Chat Components</Heading2>
            
            <Card className="p-6">
              <Heading3 className="mb-4">Message Bubbles</Heading3>
              <div className="space-y-3">
                <MessageBubble
                  message={{
                    id: '1',
                    content: 'Hey! How are you doing today?',
                    timestamp: new Date(),
                    sender: 'ai',
                    status: 'read'
                  }}
                />
                <MessageBubble
                  message={{
                    id: '2',
                    content: "I'm doing great! Just working on the new UI components. How about you?",
                    timestamp: new Date(),
                    sender: 'user',
                    status: 'read'
                  }}
                />
                <MessageBubble
                  message={{
                    id: '3',
                    content: 'Check out the new features we just implemented!',
                    timestamp: new Date(),
                    sender: 'ai',
                    status: 'delivered'
                  }}
                />
              </div>
            </Card>

            <Card className="p-0">
              <MessageComposer
                onSendMessage={(message) => console.log('Send:', message)}
                placeholder="Type your message here..."
              />
            </Card>
          </section>

          {/* Context Components */}
          <section className="space-y-6">
            <Heading2>Context Components</Heading2>
            
            <Card className="p-6">
              <Heading3 className="mb-4">Context Cards</Heading3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContextCard
                  context={{
                    id: '1',
                    title: 'Project Guidelines',
                    content: 'Core principles and coding standards for the team',
                    category: 'documentation',
                    tags: ['guidelines', 'standards'],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    wordCount: 1250
                  }}
                  onClick={() => console.log('Context clicked')}
                />
                <ContextCard
                  context={{
                    id: '2',
                    title: 'API Documentation',
                    content: 'Complete API reference with examples',
                    category: 'technical',
                    tags: ['api', 'reference'],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    wordCount: 3400
                  }}
                  onClick={() => console.log('Context clicked')}
                />
              </div>
            </Card>

            <Card className="p-6">
              <Heading3 className="mb-4">Context Selector</Heading3>
              <ContextSelector
                contexts={[
                  { id: '1', title: 'Project Guidelines', category: 'docs', tags: ['guidelines', 'standards'] },
                  { id: '2', title: 'API Documentation', category: 'code', tags: ['api', 'reference'] },
                  { id: '3', title: 'Meeting Notes', category: 'notes', tags: ['meetings', 'planning'] },
                ]}
                selectedContexts={['1']}
                onToggleContext={(id: string) => console.log('Toggle:', id)}
                onSelectAll={() => console.log('Select all')}
                onClearAll={() => console.log('Clear all')}
              />
            </Card>
          </section>

          {/* AI Components */}
          <section className="space-y-6">
            <Heading2>AI Components</Heading2>
            
            <Card className="p-6">
              <Heading3 className="mb-4">AI Insights</Heading3>
              <div className="space-y-4">
                <AIInsightsPanel 
                  insights={[
                    {
                      id: '1',
                      type: 'suggestion',
                      title: 'Code Optimization',
                      description: 'Consider using useMemo for expensive calculations.',
                      confidence: 0.85,
                      actions: [
                        { label: 'Apply', action: () => console.log('Apply suggestion') }
                      ]
                    },
                    {
                      id: '2',
                      type: 'warning',
                      title: 'Performance Issue',
                      description: 'Large bundle size detected.',
                      confidence: 0.92,
                      actions: [
                        { label: 'View Details', action: () => console.log('View details') }
                      ]
                    }
                  ]}
                />
              </div>
            </Card>

            <Card className="p-6">
              <Heading3 className="mb-4">AI Thinking Animation</Heading3>
              <div className="space-y-4">
                <ThinkingIndicator variant="inline" />
                <ThinkingIndicator variant="minimal" />
              </div>
            </Card>
          </section>
        </div>
      </div>
    </AdaptiveLayout>
  )
}

export default Showcase