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
  const [editedData, setEditedData] = useState<any>(() => {
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
      case 'experience':
        return { experience: data.experience || [] };
      case 'projects':
        return { projects: data.projects || [] };
      case 'education':
        return { education: data.education || [] };
      case 'certificates':
        return { certificates: data.certificates || [] };
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
      case 'experience':
        onSave('experience', '', (editedData as any).experience);
        break;
      case 'projects':
        onSave('projects', '', (editedData as any).projects);
        break;
      case 'education':
        onSave('education', '', (editedData as any).education);
        break;
      case 'certificates':
        onSave('certificates', '', (editedData as any).certificates);
        break;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({ ...prev, [field]: value }));
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

          {section === 'experience' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Work Experience</label>
              {((editedData as any).experience || []).map((exp: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newExp = [...(editedData as any).experience];
                        newExp.splice(index, 1);
                        setEditedData((prev: any) => ({ ...prev, experience: newExp }));
                      }}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Job Title"
                    value={exp.title || ''}
                    onChange={(e) => {
                      const newExp = [...(editedData as any).experience];
                      newExp[index] = { ...newExp[index], title: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <Input
                    placeholder="Company Name"
                    value={exp.company || ''}
                    onChange={(e) => {
                      const newExp = [...(editedData as any).experience];
                      newExp[index] = { ...newExp[index], company: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <Input
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration || ''}
                    onChange={(e) => {
                      const newExp = [...(editedData as any).experience];
                      newExp[index] = { ...newExp[index], duration: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={3}
                    placeholder="Job description and achievements"
                    value={exp.description || ''}
                    onChange={(e) => {
                      const newExp = [...(editedData as any).experience];
                      newExp[index] = { ...newExp[index], description: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, experience: newExp }));
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newExp = [...((editedData as any).experience || [])];
                  newExp.push({ title: '', company: '', duration: '', description: '' });
                  setEditedData((prev: any) => ({ ...prev, experience: newExp }));
                }}
              >
                Add Experience
              </Button>
            </div>
          )}

          {section === 'projects' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Projects</label>
              {((editedData as any).projects || []).map((project: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newProjects = [...(editedData as any).projects];
                        newProjects.splice(index, 1);
                        setEditedData((prev: any) => ({ ...prev, projects: newProjects }));
                      }}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Project Name"
                    value={project.name || ''}
                    onChange={(e) => {
                      const newProjects = [...(editedData as any).projects];
                      newProjects[index] = { ...newProjects[index], name: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, projects: newProjects }));
                    }}
                  />
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={3}
                    placeholder="Project description"
                    value={project.description || ''}
                    onChange={(e) => {
                      const newProjects = [...(editedData as any).projects];
                      newProjects[index] = { ...newProjects[index], description: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, projects: newProjects }));
                    }}
                  />
                  <Input
                    placeholder="Project Link/GitHub URL"
                    value={project.link || project.github || ''}
                    onChange={(e) => {
                      const newProjects = [...(editedData as any).projects];
                      newProjects[index] = { ...newProjects[index], link: e.target.value, github: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, projects: newProjects }));
                    }}
                  />
                  <Input
                    placeholder="Technologies (comma-separated)"
                    value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                    onChange={(e) => {
                      const newProjects = [...(editedData as any).projects];
                      const techArray = e.target.value.split(',').map((tech: string) => tech.trim()).filter(Boolean);
                      newProjects[index] = { ...newProjects[index], technologies: techArray };
                      setEditedData((prev: any) => ({ ...prev, projects: newProjects }));
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newProjects = [...((editedData as any).projects || [])];
                  newProjects.push({ name: '', description: '', link: '', github: '', stars: 0, technologies: [] });
                  setEditedData((prev: any) => ({ ...prev, projects: newProjects }));
                }}
              >
                Add Project
              </Button>
            </div>
          )}

          {section === 'education' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Education</label>
              {((editedData as any).education || []).map((edu: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newEdu = [...(editedData as any).education];
                        newEdu.splice(index, 1);
                        setEditedData((prev: any) => ({ ...prev, education: newEdu }));
                      }}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Institution/School Name"
                    value={edu.school || edu.institution || ''}
                    onChange={(e) => {
                      const newEdu = [...(editedData as any).education];
                      newEdu[index] = { ...newEdu[index], school: e.target.value, institution: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const newEdu = [...(editedData as any).education];
                      newEdu[index] = { ...newEdu[index], degree: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <Input
                    placeholder="Field of Study"
                    value={edu.field || ''}
                    onChange={(e) => {
                      const newEdu = [...(editedData as any).education];
                      newEdu[index] = { ...newEdu[index], field: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <Input
                    placeholder="Year (e.g., 2020)"
                    value={edu.year || ''}
                    onChange={(e) => {
                      const newEdu = [...(editedData as any).education];
                      newEdu[index] = { ...newEdu[index], year: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, education: newEdu }));
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newEdu = [...((editedData as any).education || [])];
                  newEdu.push({ school: '', institution: '', degree: '', field: '', year: '' });
                  setEditedData((prev: any) => ({ ...prev, education: newEdu }));
                }}
              >
                Add Education
              </Button>
            </div>
          )}

          {section === 'certificates' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Certifications</label>
              {((editedData as any).certificates || []).map((cert: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Certificate {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCerts = [...(editedData as any).certificates];
                        newCerts.splice(index, 1);
                        setEditedData((prev: any) => ({ ...prev, certificates: newCerts }));
                      }}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Certificate Name"
                    value={cert.certificate || ''}
                    onChange={(e) => {
                      const newCerts = [...(editedData as any).certificates];
                      newCerts[index] = { ...newCerts[index], certificate: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, certificates: newCerts }));
                    }}
                  />
                  <Input
                    placeholder="Issuing Organization"
                    value={cert.issuer || ''}
                    onChange={(e) => {
                      const newCerts = [...(editedData as any).certificates];
                      newCerts[index] = { ...newCerts[index], issuer: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, certificates: newCerts }));
                    }}
                  />
                  <Input
                    placeholder="Date Issued"
                    value={cert.date || ''}
                    onChange={(e) => {
                      const newCerts = [...(editedData as any).certificates];
                      newCerts[index] = { ...newCerts[index], date: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, certificates: newCerts }));
                    }}
                  />
                  <Input
                    placeholder="Certificate Link (optional)"
                    value={cert.link || ''}
                    onChange={(e) => {
                      const newCerts = [...(editedData as any).certificates];
                      newCerts[index] = { ...newCerts[index], link: e.target.value };
                      setEditedData((prev: any) => ({ ...prev, certificates: newCerts }));
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newCerts = [...((editedData as any).certificates || [])];
                  newCerts.push({ certificate: '', issuer: '', date: '', link: '' });
                  setEditedData((prev: any) => ({ ...prev, certificates: newCerts }));
                }}
              >
                Add Certificate
              </Button>
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