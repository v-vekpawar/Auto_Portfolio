'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackendResponse } from '@/lib/types';
import { X, Save } from 'lucide-react';

interface EditModalProps {
  section: string;
  data: BackendResponse;
  onSave: (section: keyof BackendResponse, field: string, value: any) => void;
  onClose: () => void;
}

export function EditModal({ section, data, onSave, onClose }: EditModalProps) {
  const [editedData, setEditedData] = useState(() => {
    switch (section) {
      case 'basic':
        return {
          name: data.name,
          headline: data.headline,
          about: data.about,
        };
      case 'contact':
        return data.contact || { email: '', phone: '' };
      case 'skills':
        return { skills: data.skills.join(', ') };
      default:
        return {};
    }
  });

  const handleSave = () => {
    switch (section) {
      case 'basic':
        onSave('name', '', (editedData as any).name);
        onSave('headline', '', (editedData as any).headline);
        onSave('about', '', (editedData as any).about);
        break;
      case 'contact':
        onSave('contact', '', editedData);
        break;
      case 'skills':
        const skillsArray = (editedData as any).skills
          .split(',')
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill.length > 0);
        onSave('skills', '', skillsArray);
        break;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit {section === 'basic' ? 'Basic Information' : section}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {section === 'basic' && (
            <>
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={(editedData as any).name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Headline</label>
                <Input
                  value={(editedData as any).headline || ''}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  placeholder="Your professional headline"
                />
              </div>
              <div>
                <label className="text-sm font-medium">About</label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  value={(editedData as any).about || ''}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </>
          )}

          {section === 'contact' && (
            <>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={(editedData as any).email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  value={(editedData as any).phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </>
          )}

          {section === 'skills' && (
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                value={(editedData as any).skills || ''}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="JavaScript, React, Node.js, Python..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate each skill with a comma
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}