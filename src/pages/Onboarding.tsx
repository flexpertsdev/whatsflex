import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageSquare, Brain, Shield, Sparkles } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import Button from '../components/ui/Button';
import { Heading2, Body } from '../components/ui/Typography';

const features = [
  {
    icon: MessageSquare,
    title: 'WhatsApp-Style Chat',
    description: 'Familiar messaging interface that feels natural and intuitive'
  },
  {
    icon: Brain,
    title: 'Context-Aware AI',
    description: 'Add documents and knowledge to enhance AI responses'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never used for training'
  },
  {
    icon: Sparkles,
    title: 'Smart Features',
    description: 'Voice messages, file sharing, and intelligent search'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setOnboarded } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const completeOnboarding = () => {
    setOnboarded(true);
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Progress dots */}
          <div className="flex justify-center mb-8 gap-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Feature display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-4">
              {(() => {
                const Icon = features[currentStep].icon;
                return <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />;
              })()}
            </div>
            <Heading2 className="mb-4">{features[currentStep].title}</Heading2>
            <Body className="text-gray-600 dark:text-gray-400">
              {features[currentStep].description}
            </Body>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={nextStep} className="w-full flex items-center justify-center gap-2">
              {currentStep < features.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                'Get Started'
              )}
            </Button>
            
            <button
              onClick={skipOnboarding}
              className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}