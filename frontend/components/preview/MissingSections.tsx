'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackendResponse } from '@/lib/types';
import { Plus, Mail, Phone, Award, GraduationCap, User, Briefcase, Code } from 'lucide-react';
import { AddSectionModal } from './AddSectionModal';

interface MissingSectionsProps {
  data: BackendResponse;
  onAddSection: (section: keyof BackendResponse, sectionData: any) => void;
}

export function MissingSections({ data, onAddSection }: MissingSectionsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Define all possible sections
  const allSections = [
    {
      key: 'contact' as keyof BackendResponse,
      label: 'Contact Information',
      icon: Mail,
      description: 'Add your email and phone number',
      isEmpty: !data.contact || (!data.contact.email && !data.contact.phone)
    },
    {
      key: 'experience' as keyof BackendResponse,
      label: 'Experience',
      icon: Briefcase,
      description: 'Add your work experience',
      isEmpty: !data.experience || data.experience.length === 0
    },
    {
      key: 'projects' as keyof BackendResponse,
      label: 'Projects',
      icon: Code,
      description: 'Add your projects and repositories',
      isEmpty: !data.projects || data.projects.length === 0
    },
    {
      key: 'skills' as keyof BackendResponse,
      label: 'Skills',
      icon: Code,
      description: 'Add your technical skills',
      isEmpty: !data.skills || data.skills.length === 0
    },
    {
      key: 'education' as keyof BackendResponse,
      label: 'Education',
      icon: GraduationCap,
      description: 'Add your educational background',
      isEmpty: !data.education || data.education.length === 0
    },
    {
      key: 'certificates' as keyof BackendResponse,
      label: 'Certificates',
      icon: Award,
      description: 'Add your professional certifications',
      isEmpty: !data.certificates || data.certificates.length === 0
    }
  ];

  const missingSections = allSections.filter(section => section.isEmpty);

  const handleAddSection = (sectionKey: string) => {
    setSelectedSection(sectionKey);
    setShowAddModal(true);
  };

  const handleSaveSection = (sectionData: any) => {
    if (selectedSection) {
      onAddSection(selectedSection as keyof BackendResponse, sectionData);
      setShowAddModal(false);
      setSelectedSection(null);
    }
  };

  if (missingSections.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Plus className="h-5 w-5" />
            Missing Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            We couldn't find these sections in your profile. Add them to make your portfolio more complete.
          </p>
          <div className="grid gap-3">
            {missingSections.map((section) => (
              <div
                key={section.key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <section.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{section.label}</h4>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddSection(section.key)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddModal && selectedSection && (
        <AddSectionModal
          sectionType={selectedSection}
          onSave={handleSaveSection}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSection(null);
          }}
        />
      )}
    </>
  );
}