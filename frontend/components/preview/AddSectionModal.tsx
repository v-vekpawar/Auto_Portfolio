'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface AddSectionModalProps {
  sectionType: string;
  onSave: (data: any) => void;
  onClose: () => void;
}

// Define specific types for each section
type ContactData = { email: string; phone: string };
type ExperienceItem = { title: string; company: string; duration: string; description: string };
type ProjectItem = { name: string; description: string; link: string; github: string; stars: number; technologies: string[] };
type SkillsData = { skills: string };
type EducationItem = { school: string; degree: string; field: string; year: string };
type CertificateItem = { certificate: string; issuer: string; date: string; link: string };

// Union type for all possible form data
type FormData = 
  | ContactData 
  | ExperienceItem[] 
  | ProjectItem[] 
  | SkillsData 
  | EducationItem[] 
  | CertificateItem[];

// Type guard functions
const isContactData = (data: FormData): data is ContactData => {
  return !Array.isArray(data) && 'email' in data;
};

const isSkillsData = (data: FormData): data is SkillsData => {
  return !Array.isArray(data) && 'skills' in data;
};

export function AddSectionModal({ sectionType, onSave, onClose }: AddSectionModalProps) {
  const [formData, setFormData] = useState<FormData>(() => {
    switch (sectionType) {
      case 'contact':
        return { email: '', phone: '' } as ContactData;
      case 'experience':
        return [{ title: '', company: '', duration: '', description: '' }] as ExperienceItem[];
      case 'projects':
        return [{ name: '', description: '', link: '', github: '', stars: 0, technologies: [] }] as ProjectItem[];
      case 'skills':
        return { skills: '' } as SkillsData;
      case 'education':
        return [{ school: '', degree: '', field: '', year: '' }] as EducationItem[];
      case 'certificates':
        return [{ certificate: '', issuer: '', date: '', link: '' }] as CertificateItem[];
      default:
        return { email: '', phone: '' } as ContactData;
    }
  });

  const handleInputChange = (field: string, value: any, index?: number) => {
    if (Array.isArray(formData)) {
      const newData = [...formData] as any[];
      if (index !== undefined) {
        newData[index] = { ...newData[index], [field]: value };
      }
      setFormData(newData as FormData);
    } else {
      setFormData({ ...formData, [field]: value } as FormData);
    }
  };

  const addItem = () => {
    if (!Array.isArray(formData)) return;

    switch (sectionType) {
      case 'experience':
        setFormData([...formData, { title: '', company: '', duration: '', description: '' }] as ExperienceItem[]);
        break;
      case 'projects':
        setFormData([...formData, { name: '', description: '', link: '', github: '', stars: 0, technologies: [] }] as ProjectItem[]);
        break;
      case 'education':
        setFormData([...formData, { school: '', degree: '', field: '', year: '' }] as EducationItem[]);
        break;
      case 'certificates':
        setFormData([...formData, { certificate: '', issuer: '', date: '', link: '' }] as CertificateItem[]);
        break;
    }
  };

  const removeItem = (index: number) => {
    if (Array.isArray(formData)) {
      setFormData(formData.filter((_, i) => i !== index) as FormData);
    }
  };

  const handleSave = () => {
    if (sectionType === 'skills' && isSkillsData(formData)) {
      // Convert comma-separated skills to array
      const skillsArray = formData.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0);
      onSave(skillsArray);
    } else {
      onSave(formData);
    }
  };

  const getSectionTitle = () => {
    switch (sectionType) {
      case 'contact': return 'Add Contact Information';
      case 'experience': return 'Add Experience';
      case 'projects': return 'Add Projects';
      case 'skills': return 'Add Skills';
      case 'education': return 'Add Education';
      case 'certificates': return 'Add Certificates';
      default: return 'Add Section';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{getSectionTitle()}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {sectionType === 'contact' && isContactData(formData) && (
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          )}

          {sectionType === 'experience' && Array.isArray(formData) && (
            <div className="space-y-4">
              {(formData as ExperienceItem[]).map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    {formData.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Job Title</label>
                        <Input
                          value={exp.title || ''}
                          onChange={(e) => handleInputChange('title', e.target.value, index)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input
                          value={exp.company || ''}
                          onChange={(e) => handleInputChange('company', e.target.value, index)}
                          placeholder="Tech Company Inc."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <Input
                        value={exp.duration || ''}
                        onChange={(e) => handleInputChange('duration', e.target.value, index)}
                        placeholder="Jan 2020 - Present"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        className="w-full p-3 border rounded-md resize-none"
                        rows={3}
                        value={exp.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value, index)}
                        placeholder="Describe your role and achievements..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addItem}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Experience
              </Button>
            </div>
          )}

          {sectionType === 'projects' && Array.isArray(formData) && (
            <div className="space-y-4">
              {(formData as ProjectItem[]).map((project, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    {formData.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm font-medium">Project Name</label>
                      <Input
                        value={project.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value, index)}
                        placeholder="My Awesome Project"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        className="w-full p-3 border rounded-md resize-none"
                        rows={2}
                        value={project.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value, index)}
                        placeholder="Brief description of your project..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Live Demo URL (Optional)</label>
                        <Input
                          type="url"
                          value={project.link || ''}
                          onChange={(e) => handleInputChange('link', e.target.value, index)}
                          placeholder="https://myproject.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">GitHub URL (Optional)</label>
                        <Input
                          type="url"
                          value={project.github || ''}
                          onChange={(e) => handleInputChange('github', e.target.value, index)}
                          placeholder="https://github.com/user/project"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Technologies (comma-separated)</label>
                      <Input
                        value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                        onChange={(e) => {
                          const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                          handleInputChange('technologies', techs, index);
                        }}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addItem}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Project
              </Button>
            </div>
          )}

          {sectionType === 'skills' && isSkillsData(formData) && (
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <textarea
                className="w-full p-3 border rounded-md resize-none mt-2"
                rows={4}
                value={formData.skills || ''}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="JavaScript, React, Node.js, Python, AWS, Docker..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate each skill with a comma
              </p>
            </div>
          )}

          {sectionType === 'education' && Array.isArray(formData) && (
            <div className="space-y-4">
              {(formData as EducationItem[]).map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    {formData.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">School/University</label>
                      <Input
                        value={edu.school || ''}
                        onChange={(e) => handleInputChange('school', e.target.value, index)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Degree</label>
                      <Input
                        value={edu.degree || ''}
                        onChange={(e) => handleInputChange('degree', e.target.value, index)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Field of Study</label>
                      <Input
                        value={edu.field || ''}
                        onChange={(e) => handleInputChange('field', e.target.value, index)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Year</label>
                      <Input
                        value={edu.year || ''}
                        onChange={(e) => handleInputChange('year', e.target.value, index)}
                        placeholder="2020"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addItem}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Education
              </Button>
            </div>
          )}

          {sectionType === 'certificates' && Array.isArray(formData) && (
            <div className="space-y-4">
              {(formData as CertificateItem[]).map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Certificate {index + 1}</h4>
                    {formData.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm font-medium">Certificate Name</label>
                      <Input
                        value={cert.certificate || ''}
                        onChange={(e) => handleInputChange('certificate', e.target.value, index)}
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Issuer</label>
                        <Input
                          value={cert.issuer || ''}
                          onChange={(e) => handleInputChange('issuer', e.target.value, index)}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date Issued</label>
                        <Input
                          value={cert.date || ''}
                          onChange={(e) => handleInputChange('date', e.target.value, index)}
                          placeholder="Mar 2023"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Certificate Link (Optional)</label>
                      <Input
                        type="url"
                        value={cert.link || ''}
                        onChange={(e) => handleInputChange('link', e.target.value, index)}
                        placeholder="https://example.com/certificate"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addItem}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Certificate
              </Button>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Section
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}