'use client';

import { BackendResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  data: BackendResponse;
  template: string;
}

export function Hero({ data, template }: HeroProps) {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={`font-bold mb-4 ${
            template === 'modern' 
              ? 'text-6xl md:text-8xl text-white' 
              : 'text-5xl md:text-7xl'
          }`}>
            {data.name}
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl mb-6 ${
              template === 'modern' 
                ? 'text-slate-300' 
                : 'text-muted-foreground'
            }`}
          >
            {data.headline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-lg max-w-3xl mx-auto mb-8 leading-relaxed ${
              template === 'modern' 
                ? 'text-slate-400' 
                : 'text-muted-foreground'
            }`}
          >
            {data.about}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className={template === 'modern' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className={template === 'modern' ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : ''}
            >
              Get In Touch
            </Button>
          </motion.div>

          {/* Contact Links */}
          {data.contact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center gap-6"
            >
              {data.contact.email && (
                <a
                  href={`mailto:${data.contact.email}`}
                  className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
                    template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                  }`}
                >
                  <Mail className="h-5 w-5" />
                  <span className="hidden sm:inline">{data.contact.email}</span>
                </a>
              )}
              {data.contact.phone && (
                <a
                  href={`tel:${data.contact.phone}`}
                  className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
                    template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  <span className="hidden sm:inline">{data.contact.phone}</span>
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}