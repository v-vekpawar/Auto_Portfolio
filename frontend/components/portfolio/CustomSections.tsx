'use client';

import { CustomSection } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface CustomSectionsProps {
  customSections: CustomSection[];
  template: string;
}

export function CustomSections({ customSections, template }: CustomSectionsProps) {
  if (!customSections || customSections.length === 0) {
    return null;
  }

  return (
    <>
      {customSections.map((section, sectionIndex) => (
        <section key={section.id} id={`custom-${section.id}`} className="py-20">
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
                {section.title}
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {section.type === 'text' && (
                  <Card className={`${
                    template === 'modern' 
                      ? 'bg-slate-800 border-slate-700' 
                      : ''
                  }`}>
                    <CardContent className="p-8">
                      <p className={`text-lg leading-relaxed ${
                        template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                      }`}>
                        {section.content.text}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {section.type === 'list' && (
                  <Card className={`${
                    template === 'modern' 
                      ? 'bg-slate-800 border-slate-700' 
                      : ''
                  }`}>
                    <CardContent className="p-8">
                      <ul className="space-y-3">
                        {section.content.items?.map((item: string, index: number) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`flex items-start gap-3 ${
                              template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              template === 'modern' 
                                ? 'bg-purple-500' 
                                : template === 'professional'
                                ? 'bg-emerald-500'
                                : 'bg-blue-500'
                            }`}></div>
                            <span className="text-lg">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {section.type === 'timeline' && (
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
                      {section.content.events?.map((event: any, index: number) => (
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
                                  <h3 className={`text-xl font-semibold ${
                                    template === 'modern' ? 'text-white' : ''
                                  }`}>
                                    {event.title}
                                  </h3>
                                  <div className={`text-sm font-medium ${
                                    template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                                  }`}>
                                    {event.date}
                                  </div>
                                </div>
                                <p className={`leading-relaxed ${
                                  template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                                }`}>
                                  {event.description}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}