'use client';

import { BackendResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactProps {
  data: BackendResponse;
  template: string;
}

export function Contact({ data, template }: ContactProps) {
  return (
    <section id="contact" className="py-20">
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
            Get In Touch
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
          }`}>
            Let's discuss opportunities and collaborate on exciting projects
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className={`text-2xl font-semibold mb-6 ${
                  template === 'modern' ? 'text-white' : ''
                }`}>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {data.contact?.email && (
                    <Card className={`${
                      template === 'modern' 
                        ? 'bg-slate-800 border-slate-700' 
                        : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            template === 'modern' 
                              ? 'bg-purple-600' 
                              : template === 'professional'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            <Mail className={`h-5 w-5 ${
                              template === 'modern' ? 'text-white' : ''
                            }`} />
                          </div>
                          <div>
                            <p className={`text-sm ${
                              template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                            }`}>
                              Email
                            </p>
                            <a
                              href={`mailto:${data.contact.email}`}
                              className={`font-medium hover:underline ${
                                template === 'modern' ? 'text-white' : ''
                              }`}
                            >
                              {data.contact.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {data.contact?.phone && (
                    <Card className={`${
                      template === 'modern' 
                        ? 'bg-slate-800 border-slate-700' 
                        : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            template === 'modern' 
                              ? 'bg-purple-600' 
                              : template === 'professional'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            <Phone className={`h-5 w-5 ${
                              template === 'modern' ? 'text-white' : ''
                            }`} />
                          </div>
                          <div>
                            <p className={`text-sm ${
                              template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                            }`}>
                              Phone
                            </p>
                            <a
                              href={`tel:${data.contact.phone}`}
                              className={`font-medium hover:underline ${
                                template === 'modern' ? 'text-white' : ''
                              }`}
                            >
                              {data.contact.phone}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full ${
                template === 'modern' 
                  ? 'bg-slate-800 border-slate-700' 
                  : ''
              }`}>
                <CardContent className="p-8 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      template === 'modern' 
                        ? 'bg-purple-600' 
                        : template === 'professional'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Send className={`h-8 w-8 ${
                        template === 'modern' ? 'text-white' : ''
                      }`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      template === 'modern' ? 'text-white' : ''
                    }`}>
                      Ready to Work Together?
                    </h3>
                    <p className={`mb-6 ${
                      template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                    }`}>
                      I'm always interested in new opportunities and exciting projects. Let's connect!
                    </p>
                    {data.contact?.email && (
                      <Button
                        size="lg"
                        asChild
                        className={`${
                          template === 'modern' 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : ''
                        }`}
                      >
                        <a href={`mailto:${data.contact.email}`}>
                          <Mail className="h-5 w-5 mr-2" />
                          Send Message
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}