'use client';

import { BackendResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperienceProps {
  data: BackendResponse;
  template: string;
}

export function Experience({ data, template }: ExperienceProps) {
  if (!data.experience || data.experience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${
            template === 'modern' ? 'text-white' : ''
          }`}>
            Work Experience
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
          }`}>
            My professional journey and key achievements
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${
              template === 'modern' 
                ? 'bg-purple-500' 
                : template === 'professional'
                ? 'bg-emerald-500'
                : 'bg-blue-500'
            }`}></div>

            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full border-4 ${
                    template === 'modern' 
                      ? 'bg-slate-900 border-purple-500' 
                      : template === 'professional'
                      ? 'bg-white border-emerald-500'
                      : 'bg-white border-blue-500'
                  }`}></div>

                  {/* Content */}
                  <div className="ml-16 flex-1">
                    <Card className={`${
                      template === 'modern' 
                        ? 'bg-slate-800 border-slate-700' 
                        : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <div>
                            <h3 className={`text-xl font-semibold ${
                              template === 'modern' ? 'text-white' : ''
                            }`}>
                              {exp.title}
                            </h3>
                            <p className={`font-medium ${
                              template === 'modern' 
                                ? 'text-purple-400' 
                                : template === 'professional'
                                ? 'text-emerald-600'
                                : 'text-blue-600'
                            }`}>
                              {exp.company}
                            </p>
                          </div>
                          <div className={`text-sm font-medium ${
                            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                          }`}>
                            {exp.duration}
                          </div>
                        </div>
                        <p className={`leading-relaxed ${
                          template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                        }`}>
                          {exp.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}