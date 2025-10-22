import axios from 'axios';
import { BackendResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://auto-portfolio-s1t9.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for scraping operations
});

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await api.get('/');
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

export async function scrapeProfile(
  linkedinUrl: string,
  githubUrl: string,
  resumeFile?: File
): Promise<BackendResponse> {
  try {
    const formData = new FormData();
    formData.append('linkedin_url', linkedinUrl);
    formData.append('github_url', githubUrl);
    
    if (resumeFile) {
      formData.append('resume_file', resumeFile);
    }

    const response = await api.post('/scrape', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to scrape profile');
    }
    throw new Error('Network error occurred');
  }
}

export async function downloadPortfolio(
  portfolioData: BackendResponse,
  template: string = 'modern'
): Promise<Blob> {
  try {
    const response = await api.post('/download-portfolio', {
      portfolio_data: portfolioData,
      template: template
    }, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to generate portfolio download');
    }
    throw new Error('Network error occurred while downloading portfolio');
  }
}

// Dummy data for development/fallback
export const DUMMY_DATA: BackendResponse = {
  name: "John Doe",
  headline: "Full-Stack Developer | React & Node.js Enthusiast",
  about: "Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and cloud infrastructure.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      duration: "Jan 2022 - Present",
      description: "Led development of microservices architecture serving 1M+ users. Mentored junior developers and established coding standards."
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      duration: "Jun 2019 - Dec 2021",
      description: "Built customer-facing features using React and Node.js. Improved application performance by 40%."
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Python", "Flask", "PostgreSQL", "MongoDB", "AWS",
    "Docker", "Git", "CI/CD", "REST APIs", "GraphQL"
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard",
      link: "https://example.com",
      github: "https://github.com/johndoe/ecommerce",
      stars: 234,
      technologies: ["React", "Node.js", "Stripe", "MongoDB"]
    },
    {
      name: "Task Management App",
      description: "Collaborative task manager with real-time updates and team features",
      link: "https://tasks.example.com",
      github: "https://github.com/johndoe/taskapp",
      stars: 89,
      technologies: ["Next.js", "Socket.io", "PostgreSQL"]
    }
  ],
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      year: "2019"
    },
    {
      school: "TechBootcamp Academy",
      degree: "Certificate",
      field: "Full Stack Web Development",
      year: "2018"
    }
  ],
  certificates: [
    {
      certificate: "AWS Certified Solutions Architect",
      link: "https://example.com/aws-cert",
      issuer: "Amazon Web Services",
      date: "Mar 2023"
    },
    {
      certificate: "Google Cloud Professional Developer",
      link: "https://example.com/gcp-cert",
      issuer: "Google Cloud",
      date: "Jan 2023"
    }
  ],
  contact: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  }
};