'use client';

import { BackendResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface EducationProps {
  data: BackendResponse;
  template: string;
}

export function Education({ data, template }: EducationProps) {
  if (!data.education || data.education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-20">
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
            Education
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
          }`}>
            My academic background and qualifications
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {data.education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`hover:shadow-lg transition-shadow ${
                  template === 'modern' 
                    ? 'bg-slate-800 border-slate-700' 
                    : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        template === 'modern' 
                          ? 'bg-purple-600' 
                          : template === 'professional'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <GraduationCap className={`h-6 w-6 ${
                          template === 'modern' ? 'text-white' : ''
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className={`text-xl font-semibold ${
                            template === 'modern' ? 'text-white' : ''
                          }`}>
                            {edu.school || edu.institution}
                          </h3>
                          <span className={`text-sm font-medium ${
                            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                          }`}>
                            {edu.year}
                          </span>
                        </div>
                        <p className={`font-medium mb-1 ${
                          template === 'modern' 
                            ? 'text-purple-400' 
                            : template === 'professional'
                            ? 'text-emerald-600'
                            : 'text-blue-600'
                        }`}>
                          {edu.degree}
                        </p>
                        <p className={`${
                          template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                        }`}>
                          {edu.field}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}