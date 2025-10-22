import { create } from 'zustand';
import { BackendResponse, FormData, TemplateType, PortfolioState, CustomSection } from '@/lib/types';

interface PortfolioStore extends PortfolioState {
  setFormData: (data: FormData) => void;
  setScrapedData: (data: BackendResponse) => void;
  updateField: (section: keyof BackendResponse, field: string, value: any) => void;
  deleteSection: (section: keyof BackendResponse) => void;
  selectTemplate: (template: TemplateType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPortfolioId: (id: string) => void;
  setCustomSections: (sections: CustomSection[]) => void;
  reset: () => void;
}

const initialState: PortfolioState = {
  formData: null,
  scrapedData: null,
  selectedTemplate: 'minimal',
  isLoading: false,
  error: null,
  portfolioId: null,
  customSections: [],
};

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  ...initialState,

  setFormData: (data: FormData) => set({ formData: data }),

  setScrapedData: (data: BackendResponse) => set({ scrapedData: data }),

  updateField: (section: keyof BackendResponse, field: string, value: any) => {
    const { scrapedData } = get();
    if (!scrapedData) return;

    const updatedData = { ...scrapedData };
    if (typeof updatedData[section] === 'object' && !Array.isArray(updatedData[section])) {
      (updatedData[section] as any)[field] = value;
    } else {
      (updatedData as any)[section] = value;
    }

    set({ scrapedData: updatedData });
  },

  deleteSection: (section: keyof BackendResponse) => {
    const { scrapedData } = get();
    if (!scrapedData) return;

    const updatedData = { ...scrapedData };
    
    // Set the section to empty array or undefined based on its type
    switch (section) {
      case 'experience':
        updatedData.experience = [];
        break;
      case 'projects':
        updatedData.projects = [];
        break;
      case 'skills':
        updatedData.skills = [];
        break;
      case 'education':
        updatedData.education = [];
        break;
      case 'certificates':
        updatedData.certificates = [];
        break;
      default:
        // For other sections, set to undefined
        (updatedData as any)[section] = undefined;
    }

    set({ scrapedData: updatedData });
  },

  selectTemplate: (template: TemplateType) => set({ selectedTemplate: template }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  setPortfolioId: (id: string) => set({ portfolioId: id }),

  setCustomSections: (sections: CustomSection[]) => set({ customSections: sections }),

  reset: () => set(initialState),
}));