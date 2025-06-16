
import React, { useState, useEffect } from 'react';
import { Sparkles, Image, FileText, Volume2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProcessingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Image, title: 'Analyzing your photo', description: 'Understanding the visual elements and composition' },
    { icon: FileText, title: 'Crafting your story', description: 'Creating a unique narrative inspired by your image' },
    { icon: Volume2, title: 'Adding voice narration', description: 'Generating professional audio narration' }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 2;
        }
        return prev;
      });
    }, 60);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Animation */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-purple-600 animate-spin" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Creating Your Story</h2>
          <p className="text-gray-600 mb-8">Our AI is working its magic to transform your photo into a captivating story</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-gray-500">{progress}% complete</p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <Card 
                key={index}
                className={`transition-all duration-500 ${
                  isActive 
                    ? 'border-purple-300 bg-purple-50 scale-105' 
                    : isCompleted 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 bg-white/60'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300 ${
                      isActive 
                        ? 'bg-purple-200' 
                        : isCompleted 
                        ? 'bg-green-200' 
                        : 'bg-gray-200'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isActive 
                          ? 'text-purple-600 animate-pulse' 
                          : isCompleted 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-semibold ${
                        isActive ? 'text-purple-800' : isCompleted ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${
                        isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estimated Time */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Estimated time remaining: {Math.max(0, Math.ceil((100 - progress) / 20))} seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingState;
