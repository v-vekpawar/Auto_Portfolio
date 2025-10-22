'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataPreview } from '@/components/preview/DataPreview';
import { TemplateSelector } from '@/components/preview/TemplateSelector';
import DownloadButton from '@/components/ui/DownloadButton';
import AutoPortfolioLogo from '@/components/ui/AutoPortfolioLogo';
import { usePortfolioStore } from '@/store/portfolioStore';
import { generatePortfolioId } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PreviewPage() {
  const {
    scrapedData,
    selectedTemplate,
    customSections,
    updateField,
    deleteSection,
    selectTemplate,
    setPortfolioId,
    setCustomSections,
  } = usePortfolioStore();
  const router = useRouter();

  useEffect(() => {
    if (!scrapedData) {
      router.push('/generate');
    }
  }, [scrapedData, router]);

  const handleGeneratePortfolio = () => {
    const id = generatePortfolioId();
    setPortfolioId(id);
    router.push(`/portfolio/${id}`);
  };

  if (!scrapedData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <AutoPortfolioLogo size="lg" />
          </Link>
          <Button variant="outline" asChild>
            <Link href="/generate" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Review Your Data
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check the extracted information and choose your preferred template. You can edit any section before generating your portfolio.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Data Preview - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <DataPreview
              data={scrapedData}
              onUpdate={updateField}
              onDeleteSection={deleteSection}
              customSections={customSections}
              onUpdateCustomSections={setCustomSections}
            />
          </motion.div>

          {/* Template Selector - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border p-6 sticky top-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={selectTemplate}
              />

              <div className="mt-8 pt-6 border-t space-y-4">
                <Button
                  onClick={handleGeneratePortfolio}
                  className="w-full"
                  size="lg"
                >
                  Generate Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  This will create your live portfolio page
                </p>
                
                <div className="pt-4 border-t">
                  <DownloadButton
                    portfolioData={scrapedData}
                    template={selectedTemplate}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Download as standalone website files
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}