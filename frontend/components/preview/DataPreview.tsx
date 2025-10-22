'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditModal } from './EditModal';
import { MissingSections } from './MissingSections';
import { CustomSectionCreator } from './CustomSectionCreator';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { BackendResponse, CustomSection } from '@/lib/types';
import { Edit, User, Briefcase, Code, GraduationCap, Mail, Phone, Award, Trash2 } from 'lucide-react';

interface DataPreviewProps {
  data: BackendResponse;
  onUpdate: (section: keyof BackendResponse, field: string, value: any) => void;
}

interface ExtendedDataPreviewProps extends DataPreviewProps {
  customSections: CustomSection[];
  onUpdateCustomSections: (sections: CustomSection[]) => void;
  onDeleteSection?: (section: keyof BackendResponse) => void;
}

export function DataPreview({ data, onUpdate, customSections = [], onUpdateCustomSections, onDeleteSection }: ExtendedDataPreviewProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [deletingSection, setDeletingSection] = useState<keyof BackendResponse | null>(null);

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSave = (section: keyof BackendResponse, field: string, value: any) => {
    onUpdate(section, field, value);
    setEditingSection(null);
  };

  const handleAddSection = (section: keyof BackendResponse, sectionData: any) => {
    onUpdate(section, '', sectionData);
  };

  const handleAddCustomSection = (section: CustomSection) => {
    onUpdateCustomSections([...customSections, section]);
  };

  const handleUpdateCustomSection = (id: string, section: CustomSection) => {
    onUpdateCustomSections(
      customSections.map(s => s.id === id ? section : s)
    );
  };

  const handleDeleteCustomSection = (id: string) => {
    onUpdateCustomSections(customSections.filter(s => s.id !== id));
  };

  const handleDeleteSection = (section: keyof BackendResponse) => {
    setDeletingSection(section);
  };

  const confirmDeleteSection = () => {
    if (deletingSection && onDeleteSection) {
      onDeleteSection(deletingSection);
      setDeletingSection(null);
    }
  };

  const getSectionDisplayName = (section: keyof BackendResponse) => {
    switch (section) {
      case 'experience': return 'Experience';
      case 'projects': return 'Projects';
      case 'skills': return 'Skills';
      case 'education': return 'Education';
      case 'certificates': return 'Certificates';
      default: return section;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit('basic')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{data.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Headline</label>
              <p className="text-gray-900">{data.headline}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">About</label>
              <p className="text-gray-700 leading-relaxed">{data.about}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      {data.contact && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit('contact')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{data.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{data.contact.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience ({data.experience.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('experience')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSection('experience')}
                className="text-red-500 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Projects ({data.projects.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('projects')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSection('projects')}
                className="text-red-500 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {data.projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-500">⭐ {project.stars}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills ({data.skills.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('skills')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSection('skills')}
                className="text-red-500 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education ({data.education.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('education')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSection('education')}
                className="text-red-500 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <h3 className="font-semibold text-gray-900">
                    {edu.school || edu.institution}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificates */}
      {data.certificates && data.certificates.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificates ({data.certificates.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('certificates')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSection('certificates')}
                className="text-red-500 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.certificates.map((cert, index) => (
                <div key={index} className="border-l-2 border-orange-200 pl-4">
                  <h3 className="font-semibold text-gray-900">{cert.certificate}</h3>
                  <p className="text-orange-600 font-medium">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">{cert.date}</p>
                  {cert.link && cert.link !== 'Link to Certificate' && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Sections Display */}
      {customSections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {section.title} (Custom)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteCustomSection(section.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </Button>
          </CardHeader>
          <CardContent>
            {section.type === 'text' && (
              <p className="text-gray-700">{section.content.text}</p>
            )}
            {section.type === 'list' && (
              <ul className="list-disc list-inside space-y-1">
                {section.content.items?.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            )}
            {section.type === 'timeline' && (
              <div className="space-y-4">
                {section.content.events?.map((event: any, index: number) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.date}</p>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Missing Sections */}
      <MissingSections
        data={data}
        onAddSection={handleAddSection}
      />

      {/* Custom Section Creator */}
      <CustomSectionCreator
        customSections={customSections}
        onAddCustomSection={handleAddCustomSection}
        onUpdateCustomSection={handleUpdateCustomSection}
        onDeleteCustomSection={handleDeleteCustomSection}
      />

      {/* Edit Modal */}
      {editingSection && (
        <EditModal
          section={editingSection}
          data={data}
          onSave={handleSave}
          onClose={() => setEditingSection(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingSection}
        onOpenChange={(open) => !open && setDeletingSection(null)}
        title={`Delete ${deletingSection ? getSectionDisplayName(deletingSection) : ''} Section`}
        description={`Are you sure you want to delete the ${deletingSection ? getSectionDisplayName(deletingSection).toLowerCase() : ''} section? This action cannot be undone.`}
        onConfirm={confirmDeleteSection}
        confirmText="Delete Section"
      />
    </div>
  );
}