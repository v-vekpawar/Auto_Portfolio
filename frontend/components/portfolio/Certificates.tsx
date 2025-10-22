'use client';

import { BackendResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface CertificatesProps {
  data: BackendResponse;
  template: string;
}

export function Certificates({ data, template }: CertificatesProps) {
  if (!data.certificates || data.certificates.length === 0) {
    return null;
  }

  return (
    <section id="certificates" className="py-20">
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
            Licenses & Certifications
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
          }`}>
            Professional certifications and achievements
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {data.certificates.map((cert, index) => (
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
                        <Award className={`h-6 w-6 ${
                          template === 'modern' ? 'text-white' : ''
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                          <div>
                            <h3 className={`text-xl font-semibold mb-1 ${
                              template === 'modern' ? 'text-white' : ''
                            }`}>
                              {cert.certificate}
                            </h3>
                            <p className={`font-medium ${
                              template === 'modern' 
                                ? 'text-purple-400' 
                                : template === 'professional'
                                ? 'text-emerald-600'
                                : 'text-blue-600'
                            }`}>
                              {cert.issuer}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-sm font-medium ${
                              template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                            }`}>
                              {cert.date}
                            </span>
                            {cert.link && cert.link !== 'Link to Certificate' && (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className={`${
                                  template === 'modern' 
                                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                                    : ''
                                }`}
                              >
                                <a
                                  href={cert.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Certificate
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
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