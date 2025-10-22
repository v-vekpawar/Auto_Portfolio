'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DownloadButton from '@/components/ui/DownloadButton';
import AutoPortfolioWatermark from '@/components/ui/AutoPortfolioWatermark';
import { AutoPortfolioIcon } from '@/components/ui/AutoPortfolioLogo';
import { Hero } from '@/components/portfolio/Hero';
import { Experience } from '@/components/portfolio/Experience';
import { Projects } from '@/components/portfolio/Projects';
import { Skills } from '@/components/portfolio/Skills';
import { Education } from '@/components/portfolio/Education';
import { Certificates } from '@/components/portfolio/Certificates';
import { CustomSections } from '@/components/portfolio/CustomSections';
import { Contact } from '@/components/portfolio/Contact';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Edit, ArrowUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioPageProps {
  params: {
    id: string;
  };
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const { scrapedData, selectedTemplate, customSections } = usePortfolioStore();
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!scrapedData) {
      router.push('/generate');
      return;
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrapedData, router]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!scrapedData) {
    return null;
  }

  // Apply template-specific classes to the body
  const templateClass = `template-${selectedTemplate}`;

  return (
    <div className={`min-h-screen ${templateClass} ${
      selectedTemplate === 'modern' 
        ? 'bg-slate-900' 
        : selectedTemplate === 'professional'
        ? 'bg-gray-50'
        : 'bg-white'
    }`}>
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all ${
        selectedTemplate === 'modern' 
          ? 'bg-slate-900/80 border-slate-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AutoPortfolioIcon 
                size="sm" 
                theme={selectedTemplate === 'modern' ? 'dark' : 'light'} 
              />
              <span className={`font-bold ${
                selectedTemplate === 'modern' ? 'text-white' : 'text-gray-900'
              }`}>
                {scrapedData.name}
              </span>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                { label: 'About', id: 'hero', show: true },
                { label: 'Experience', id: 'experience', show: scrapedData.experience && scrapedData.experience.length > 0 },
                { label: 'Projects', id: 'projects', show: scrapedData.projects && scrapedData.projects.length > 0 },
                { label: 'Skills', id: 'skills', show: scrapedData.skills && scrapedData.skills.length > 0 },
                { label: 'Education', id: 'education', show: scrapedData.education && scrapedData.education.length > 0 },
                { label: 'Certificates', id: 'certificates', show: scrapedData.certificates && scrapedData.certificates.length > 0 },
                ...customSections.map(section => ({
                  label: section.title,
                  id: `custom-${section.id}`,
                  show: true
                })),
                { label: 'Contact', id: 'contact', show: true },
              ].filter(item => item.show).map((item) => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className={`text-sm hover:opacity-80 transition-opacity ${
                    selectedTemplate === 'modern' ? 'text-slate-300' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <DownloadButton
                portfolioData={scrapedData}
                template={selectedTemplate}
                variant="outline"
                size="sm"
                className={selectedTemplate === 'modern' ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : ''}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/preview')}
                className={selectedTemplate === 'modern' ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : ''}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <div id="hero">
          <Hero data={scrapedData} template={selectedTemplate} />
        </div>

        {scrapedData.experience && scrapedData.experience.length > 0 && (
          <div id="experience">
            <Experience data={scrapedData} template={selectedTemplate} />
          </div>
        )}

        {scrapedData.projects && scrapedData.projects.length > 0 && (
          <div id="projects">
            <Projects data={scrapedData} template={selectedTemplate} />
          </div>
        )}

        {scrapedData.skills && scrapedData.skills.length > 0 && (
          <div id="skills">
            <Skills data={scrapedData} template={selectedTemplate} />
          </div>
        )}

        {scrapedData.education && scrapedData.education.length > 0 && (
          <div id="education">
            <Education data={scrapedData} template={selectedTemplate} />
          </div>
        )}

        {scrapedData.certificates && scrapedData.certificates.length > 0 && (
          <div id="certificates">
            <Certificates data={scrapedData} template={selectedTemplate} />
          </div>
        )}

        {/* Custom Sections */}
        <CustomSections customSections={customSections} template={selectedTemplate} />

        <div id="contact">
          <Contact data={scrapedData} template={selectedTemplate} />
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${
        selectedTemplate === 'modern' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm mb-2 ${
            selectedTemplate === 'modern' ? 'text-slate-400' : 'text-gray-600'
          }`}>
            © {new Date().getFullYear()} {scrapedData.name}. All rights reserved.
          </p>
          <AutoPortfolioWatermark variant="footer" />
        </div>
      </footer>

      {/* Floating Watermark */}
      <AutoPortfolioWatermark variant="floating" />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-colors z-50 ${
              selectedTemplate === 'modern' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : selectedTemplate === 'professional'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}