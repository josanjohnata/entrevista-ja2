import { useState, useEffect, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumeData } from '../domain/resume/types';
import { ProfileToResumeAdapter } from '../infrastructure/adapters/ProfileToResumeAdapter';
import { UserProfile } from '../types';
import { PDFDocument } from '../components/Resume/PDFDocument';

interface UseResumeEditorProps {
  profile: UserProfile | null;
  userEmail?: string;
}

interface UseResumeEditorReturn {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  downloadPDF: () => Promise<void>;
  isGeneratingPDF: boolean;
  hasUnsavedChanges: boolean;
  convertToProfile: () => Partial<UserProfile>;
}

export function useResumeEditor({ profile, userEmail }: UseResumeEditorProps): UseResumeEditorReturn {
  const [resumeData, setResumeData] = useState<ResumeData>(() =>
    ProfileToResumeAdapter.convert(profile, userEmail)
  );
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [initialData, setInitialData] = useState<string>('');

  useEffect(() => {
    const newResumeData = ProfileToResumeAdapter.convert(profile, userEmail);
    setResumeData(newResumeData);
    setInitialData(JSON.stringify(newResumeData));
  }, [profile, userEmail]);

  const hasUnsavedChanges = JSON.stringify(resumeData) !== initialData;

  const downloadPDF = useCallback(async () => {
    setIsGeneratingPDF(true);

    try {
      const blob = await pdf(<PDFDocument data={resumeData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = resumeData.name
        ? `curriculo_${resumeData.name.replace(/\s+/g, '_')}.pdf`
        : 'curriculo.pdf';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [resumeData]);

  const convertToProfile = useCallback((): Partial<UserProfile> => {
    return ProfileToResumeAdapter.convertBack(resumeData);
  }, [resumeData]);

  return {
    resumeData,
    setResumeData,
    downloadPDF,
    isGeneratingPDF,
    hasUnsavedChanges,
    convertToProfile,
  };
}
