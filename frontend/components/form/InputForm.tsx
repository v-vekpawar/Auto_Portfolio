'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from './FileUpload';
import { LoadingState } from './LoadingState';
import { validateUrl } from '@/lib/utils';
import { scrapeProfile } from '@/lib/api';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useRouter } from 'next/navigation';
import { AlertCircle, Linkedin, Github } from 'lucide-react';

const formSchema = z.object({
  linkedin_url: z.string()
    .optional()
    .refine((url) => !url || validateUrl(url, 'linkedin'), 'Please enter a valid LinkedIn profile URL'),
  github_url: z.string()
    .optional()
    .refine((url) => !url || validateUrl(url, 'github'), 'Please enter a valid GitHub profile URL'),
}).refine((data) => {
  // At least one field must be provided (we'll check resume file separately)
  return data.linkedin_url || data.github_url;
}, {
  message: "Please provide at least one: LinkedIn URL, GitHub URL, or Resume file",
  path: ["root"] // This will be a form-level error
});

type FormData = z.infer<typeof formSchema>;

export function InputForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { setFormData, setScrapedData, setLoading, setError, isLoading, error } = usePortfolioStore();
  const router = useRouter();

  // Cleanup loading state when component unmounts (navigation happens)
  useEffect(() => {
    return () => {
      if (isNavigating) {
        setLoading(false);
        setCurrentFormData(null);
      }
    };
  }, [isNavigating, setLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      // Check if at least one input is provided (including resume)
      if (!data.linkedin_url && !data.github_url && !resumeFile) {
        setError('Please provide at least one: LinkedIn URL, GitHub URL, or Resume file');
        return;
      }

      // Store current form data for loading state
      setCurrentFormData(data);

      // Store form data
      setFormData({
        linkedin_url: data.linkedin_url || '',
        github_url: data.github_url || '',
        resume_file: resumeFile || undefined,
      });

      // Call API with only provided data
      const result = await scrapeProfile(
        data.linkedin_url || '',
        data.github_url || '',
        resumeFile || undefined
      );

      setScrapedData(result);
      setIsNavigating(true);
      router.push('/preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      setCurrentFormData(null);
    }
  };

  if (isLoading || isNavigating) {
    // Determine what data sources are being processed
    const hasLinkedIn = Boolean(currentFormData?.linkedin_url);
    const hasGitHub = Boolean(currentFormData?.github_url);
    const hasResume = Boolean(resumeFile);
    
    return (
      <LoadingState 
        hasLinkedIn={hasLinkedIn}
        hasGitHub={hasGitHub}
        hasResume={hasResume}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Portfolio</CardTitle>
          <CardDescription>
            Provide at least one: LinkedIn URL, GitHub URL, or Resume file. We'll generate your portfolio from the available data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* LinkedIn URL */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                LinkedIn Profile URL
              </label>
              <Input
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/your-profile"
                className={errors.linkedin_url ? 'border-red-500' : ''}
              />
              {errors.linkedin_url && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.linkedin_url.message}
                </p>
              )}
            </div> */}

            {/* GitHub URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Profile URL
              </label>
              <Input
                {...register('github_url')}
                placeholder="https://github.com/your-username"
                className={errors.github_url ? 'border-red-500' : ''}
              />
              {errors.github_url && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.github_url.message}
                </p>
              )}
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Resume
              </label>
              <FileUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
              />
            </div>

            {/* At least one required notice */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Please provide at least one of the above options to generate your portfolio.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              Generate Portfolio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}