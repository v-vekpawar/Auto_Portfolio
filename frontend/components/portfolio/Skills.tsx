'use client';

import { BackendResponse } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SkillsProps {
  data: BackendResponse;
  template: string;
}

export function Skills({ data, template }: SkillsProps) {
  if (!data.skills || data.skills.length === 0) {
    return null;
  }

  // Group skills by category (basic categorization)
  const categorizeSkills = (skills: string[]) => {
    const categories = {
      'Frontend': [] as string[],
      'Backend': [] as string[],
      'Database': [] as string[],
      'Tools & Others': [] as string[],
    };

    const frontendKeywords = ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'bootstrap', 'next.js', 'nuxt'];
    const backendKeywords = ['node.js', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'c#', 'flask', 'django', 'express', 'spring'];
    const databaseKeywords = ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'firebase', 'supabase'];

    skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      if (frontendKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories.Frontend.push(skill);
      } else if (backendKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories.Backend.push(skill);
      } else if (databaseKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories.Database.push(skill);
      } else {
        categories['Tools & Others'].push(skill);
      }
    });

    return categories;
  };

  const skillCategories = categorizeSkills(data.skills);

  return (
    <section id="skills" className="py-20">
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
            Skills & Technologies
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            template === 'modern' ? 'text-slate-400' : 'text-muted-foreground'
          }`}>
            Technologies and tools I work with
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {Object.entries(skillCategories).map(([category, skills], categoryIndex) => {
            if (skills.length === 0) return null;
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h3 className={`text-xl font-semibold mb-4 ${
                  template === 'modern' ? 'text-white' : ''
                }`}>
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant={template === 'modern' ? 'secondary' : 'outline'}
                        className={`text-sm px-4 py-2 cursor-default transition-all ${
                          template === 'modern' 
                            ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-purple-600 hover:text-white' 
                            : template === 'professional'
                            ? 'hover:bg-emerald-50 hover:border-emerald-300'
                            : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}