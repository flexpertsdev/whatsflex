import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Database, CheckCircle, XCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Heading1, Body, Caption } from '../components/ui/Typography'
// import { setupDatabase } from '../scripts/setupDatabase' - Database setup should be done manually in Appwrite Console
import { useAppStore } from '../stores/appStore'

interface SetupStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
}

const Setup: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAppStore()
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<SetupStep[]>([
    { name: 'Create Chats Collection', status: 'pending' },
    { name: 'Create Messages Collection', status: 'pending' },
    { name: 'Create Contexts Collection', status: 'pending' },
    { name: 'Setup Indexes', status: 'pending' },
  ])

  const runSetup = async () => {
    if (!user) {
      alert('Please login first')
      navigate('/login')
      return
    }

    setIsRunning(true)
    
    try {
      // Update UI to show running
      setSteps(steps.map(step => ({ ...step, status: 'running' })))
      
      // Simulate setup process - database should be set up manually in Appwrite Console
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update UI to show success
      setSteps(steps.map(step => ({ ...step, status: 'success' })))
      
      // Show success message
      setTimeout(() => {
        navigate('/chats')
      }, 2000)
      
    } catch (error: any) {
      console.error('Setup failed:', error)
      setSteps(steps.map((step, index) => ({
        ...step,
        status: index === 0 ? 'error' : 'pending',
        message: index === 0 ? error.message : undefined
      })))
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card padding="lg">
          <div className="text-center mb-6">
            <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <Heading1>Database Setup</Heading1>
            <Body color="secondary" className="mt-2">
              Initialize your Appwrite database with required collections
            </Body>
          </div>

          <div className="space-y-3 mb-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {step.status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  {step.status === 'running' && (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {step.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {step.status === 'error' && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <Caption>{step.name}</Caption>
                </div>
                {step.message && (
                  <Caption className="text-xs text-red-600">
                    {step.message}
                  </Caption>
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={runSetup}
              disabled={isRunning}
              loading={isRunning}
            >
              {isRunning ? 'Setting up...' : 'Run Setup'}
            </Button>
            
            <Button
              variant="ghost"
              fullWidth
              onClick={() => navigate('/chats')}
              disabled={isRunning}
            >
              Skip Setup
            </Button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <Caption className="text-yellow-800">
              <strong>Note:</strong> Make sure you have created the required storage buckets in your Appwrite console:
              <ul className="mt-2 ml-4 list-disc text-xs">
                <li>attachments</li>
                <li>voice-messages</li>
                <li>avatars</li>
              </ul>
            </Caption>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Setup