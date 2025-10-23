'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Linkedin, Github, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  hasLinkedIn?: boolean;
  hasGitHub?: boolean;
  hasResume?: boolean;
}

export function LoadingState({ hasLinkedIn = false, hasGitHub = false, hasResume = false }: LoadingStateProps) {
  // Build dynamic steps based on what data sources are provided
  const allSteps = [
    {
      icon: Linkedin,
      label: 'Scraping LinkedIn profile...',
      condition: hasLinkedIn,
      key: 'linkedin'
    },
    {
      icon: Github,
      label: 'Fetching GitHub repositories...',
      condition: hasGitHub,
      key: 'github'
    },
    {
      icon: FileText,
      label: 'Processing resume data...',
      condition: hasResume,
      key: 'resume'
    },
    {
      icon: Sparkles,
      label: 'Getting your data please be patient...',
      condition: true, // Always show AI enhancement
      key: 'ai'
    },
  ];

  // Filter steps based on conditions and add delays
  const steps = allSteps
    .filter(step => step.condition)
    .map((step, index) => ({
      ...step,
      delay: index
    }));

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader2 className="h-12 w-12 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Creating Your Portfolio</h2>
            <p className="text-gray-600">
              Please wait while we extract and process your data...
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay * 0.5, duration: 0.5 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <step.icon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">{step.label}</span>
                <div className="flex-1 flex justify-end">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Tip:</strong> This process may take {steps.length > 2 ? '30-60' : '15-30'} seconds depending on the amount of data to process.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}