'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TemplateType } from '@/lib/types';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
}

const templates = [
  {
    id: 'minimal' as TemplateType,
    name: 'Minimal',
    description: 'Clean and simple design with focus on content',
    preview: 'bg-white border-blue-200',
    accent: 'bg-blue-600',
  },
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Dark theme with purple accents and bold typography',
    preview: 'bg-slate-900 border-purple-400',
    accent: 'bg-purple-500',
  },
  {
    id: 'professional' as TemplateType,
    name: 'Professional',
    description: 'Corporate style with green accents and structured layout',
    preview: 'bg-gray-50 border-emerald-300',
    accent: 'bg-emerald-600',
  },
];

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Your Template</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'ring-2 ring-blue-500 shadow-md'
                : 'hover:shadow-sm'
            }`}
            onClick={() => onSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="relative">
                {/* Template Preview */}
                <div className={`h-32 rounded-lg border-2 ${template.preview} p-3 mb-3`}>
                  <div className={`h-2 ${template.accent} rounded mb-2 w-3/4`}></div>
                  <div className="h-1 bg-gray-300 rounded mb-1 w-full"></div>
                  <div className="h-1 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="flex gap-1">
                    <div className={`h-1 ${template.accent} rounded w-1/4`}></div>
                    <div className={`h-1 ${template.accent} rounded w-1/5`}></div>
                    <div className={`h-1 ${template.accent} rounded w-1/6`}></div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                {/* Template Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}