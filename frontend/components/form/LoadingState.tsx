'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Linkedin, Github, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingState() {
  const steps = [
    { icon: Linkedin, label: 'Scraping LinkedIn profile...', delay: 0 },
    { icon: Github, label: 'Fetching GitHub repositories...', delay: 1 },
    { icon: FileText, label: 'Processing resume data...', delay: 2 },
    { icon: Sparkles, label: 'Generating portfolio...', delay: 3 },
  ];

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
              <strong>Tip:</strong> This process may take 30-60 seconds depending on the amount of data to process.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}