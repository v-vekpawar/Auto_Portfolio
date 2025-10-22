'use client';

import { InputForm } from '@/components/form/InputForm';
import { Button } from '@/components/ui/button';
import AutoPortfolioLogo from '@/components/ui/AutoPortfolioLogo';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <AutoPortfolioLogo size="lg" />
          </Link>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let's Build Your Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Provide at least one: LinkedIn URL, GitHub URL, or Resume file. We'll create your portfolio from the available data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InputForm />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">LinkedIn Profile Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Make sure your profile is public</li>
                <li>• Use the full LinkedIn URL (e.g., linkedin.com/in/yourname)</li>
                <li>• Ensure your experience and skills sections are complete</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">GitHub Profile Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Make sure your repositories are public</li>
                <li>• Add descriptions to your important projects</li>
                <li>• Use topics/tags to categorize your repositories</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Resume Upload Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Supports PDF, DOC, and DOCX formats</li>
                <li>• Maximum file size: 16MB</li>
                <li>• Resume data takes highest priority</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}