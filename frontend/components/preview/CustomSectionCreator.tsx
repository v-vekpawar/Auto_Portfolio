'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Trash2, Edit } from 'lucide-react';

interface CustomSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'timeline';
  content: any;
}

interface CustomSectionCreatorProps {
  customSections: CustomSection[];
  onAddCustomSection: (section: CustomSection) => void;
  onUpdateCustomSection: (id: string, section: CustomSection) => void;
  onDeleteCustomSection: (id: string) => void;
}

export function CustomSectionCreator({
  customSections,
  onAddCustomSection,
  onUpdateCustomSection,
  onDeleteCustomSection
}: CustomSectionCreatorProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);

  return (
    <>
      <Card className="border-dashed border-2 border-blue-300 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Plus className="h-5 w-5" />
            Custom Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600 mb-4">
            Create your own sections to showcase additional information not covered in standard sections.
          </p>
          
          {/* Existing Custom Sections */}
          {customSections.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="font-medium text-gray-900">Your Custom Sections:</h4>
              {customSections.map((section) => (
                <div key={section.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{section.type}</Badge>
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteCustomSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Create Custom Section
          </Button>
        </CardContent>
      </Card>

      {(showCreateModal || editingSection) && (
        <CustomSectionModal
          section={editingSection}
          onSave={(section) => {
            if (editingSection) {
              onUpdateCustomSection(editingSection.id, section);
            } else {
              onAddCustomSection({
                ...section,
                id: Date.now().toString()
              });
            }
            setShowCreateModal(false);
            setEditingSection(null);
          }}
          onClose={() => {
            setShowCreateModal(false);
            setEditingSection(null);
          }}
        />
      )}
    </>
  );
}

interface CustomSectionModalProps {
  section?: CustomSection | null;
  onSave: (section: CustomSection) => void;
  onClose: () => void;
}

function CustomSectionModal({ section, onSave, onClose }: CustomSectionModalProps) {
  const [title, setTitle] = useState(section?.title || '');
  const [type, setType] = useState<'text' | 'list' | 'timeline'>(section?.type || 'text');
  const [content, setContent] = useState(() => {
    if (section?.content) return section.content;
    
    switch (type) {
      case 'text':
        return { text: '' };
      case 'list':
        return { items: [''] };
      case 'timeline':
        return { events: [{ title: '', description: '', date: '' }] };
      default:
        return { text: '' };
    }
  });

  const handleTypeChange = (newType: 'text' | 'list' | 'timeline') => {
    setType(newType);
    switch (newType) {
      case 'text':
        setContent({ text: '' });
        break;
      case 'list':
        setContent({ items: [''] });
        break;
      case 'timeline':
        setContent({ events: [{ title: '', description: '', date: '' }] });
        break;
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: section?.id || '',
      title: title.trim(),
      type,
      content
    });
  };

  const addListItem = () => {
    setContent(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  const updateListItem = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      items: prev.items.map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const removeListItem = (index: number) => {
    setContent(prev => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index)
    }));
  };

  const addTimelineEvent = () => {
    setContent(prev => ({
      ...prev,
      events: [...prev.events, { title: '', description: '', date: '' }]
    }));
  };

  const updateTimelineEvent = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      events: prev.events.map((event: any, i: number) => 
        i === index ? { ...event, [field]: value } : event
      )
    }));
  };

  const removeTimelineEvent = (index: number) => {
    setContent(prev => ({
      ...prev,
      events: prev.events.filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{section ? 'Edit Custom Section' : 'Create Custom Section'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Title */}
          <div>
            <label className="text-sm font-medium">Section Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Hobbies, Volunteer Work, Awards"
            />
          </div>

          {/* Section Type */}
          <div>
            <label className="text-sm font-medium">Section Type</label>
            <div className="flex gap-2 mt-2">
              {[
                { value: 'text', label: 'Text Block' },
                { value: 'list', label: 'Bullet List' },
                { value: 'timeline', label: 'Timeline' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={type === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTypeChange(option.value as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Based on Type */}
          <div>
            <label className="text-sm font-medium">Content</label>
            
            {type === 'text' && (
              <textarea
                className="w-full p-3 border rounded-md resize-none mt-2"
                rows={4}
                value={content.text || ''}
                onChange={(e) => setContent({ text: e.target.value })}
                placeholder="Enter your text content..."
              />
            )}

            {type === 'list' && (
              <div className="space-y-2 mt-2">
                {content.items?.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateListItem(index, e.target.value)}
                      placeholder={`List item ${index + 1}`}
                    />
                    {content.items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem(index)}
                        className="text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addListItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            )}

            {type === 'timeline' && (
              <div className="space-y-4 mt-2">
                {content.events?.map((event: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Event {index + 1}</h4>
                      {content.events.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimelineEvent(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Input
                        value={event.title}
                        onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                        placeholder="Event title"
                      />
                      <Input
                        value={event.date}
                        onChange={(e) => updateTimelineEvent(index, 'date', e.target.value)}
                        placeholder="Date (e.g., 2023, Jan 2023)"
                      />
                      <textarea
                        className="w-full p-3 border rounded-md resize-none"
                        rows={2}
                        value={event.description}
                        onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                        placeholder="Event description"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTimelineEvent}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {section ? 'Update Section' : 'Create Section'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}