'use client';

import { BackendResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectsProps {
  data: BackendResponse;
  template: string;
}

export function Projects({ data, template }: ProjectsProps) {
  if (!data.projects || data.projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-20">
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
            Featured Projects
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
          }`}>
            A showcase of my recent work and contributions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full hover:shadow-lg transition-all duration-300 group ${
                template === 'modern' 
                  ? 'bg-slate-800 border-slate-700 hover:border-purple-500' 
                  : 'hover:shadow-xl'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className={`text-lg group-hover:text-primary transition-colors ${
                      template === 'modern' ? 'text-white' : ''
                    }`}>
                      {project.name}
                    </CardTitle>
                    {project.stars > 0 && (
                      <div className={`flex items-center gap-1 text-sm ${
                        template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
                      }`}>
                        <Star className="h-4 w-4" />
                        {project.stars}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-sm leading-relaxed ${
                    template === 'modern' ? 'text-slate-300' : 'text-muted-foreground'
                  }`}>
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant={template === 'modern' ? 'secondary' : 'outline'}
                        className={`text-xs ${
                          template === 'modern' 
                            ? 'bg-slate-700 text-slate-300 border-slate-600' 
                            : ''
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          template === 'modern' 
                            ? 'border-slate-600 text-slate-400' 
                            : ''
                        }`}
                      >
                        +{project.technologies.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 pt-2">
                    {project.github && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className={`flex-1 ${
                          template === 'modern' 
                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                            : ''
                        }`}
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.link && project.link !== project.github && (
                      <Button
                        size="sm"
                        asChild
                        className={`flex-1 ${
                          template === 'modern' 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : ''
                        }`}
                      >
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}