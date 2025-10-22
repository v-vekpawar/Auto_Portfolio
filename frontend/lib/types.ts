export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
  github: string;
  stars: number;
  technologies: string[];
}

export interface Education {
  school?: string;
  institution?: string;
  degree: string;
  field: string;
  year: string;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Certificate {
  certificate: string;
  link: string;
  issuer: string;
  date: string;
}

export interface BackendResponse {
  name: string;
  headline: string;
  about: string;
  experience: Experience[];
  skills: string[];
  projects: Project[];
  education?: Education[];
  certificates?: Certificate[];
  contact?: Contact;
}

export interface FormData {
  linkedin_url: string;
  github_url: string;
  resume_file?: File;
}

export type TemplateType = 'minimal' | 'modern' | 'professional';

export interface CustomSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'timeline';
  content: any;
}

export interface PortfolioState {
  formData: FormData | null;
  scrapedData: BackendResponse | null;
  selectedTemplate: TemplateType;
  isLoading: boolean;
  error: string | null;
  portfolioId: string | null;
  customSections: CustomSection[];
}