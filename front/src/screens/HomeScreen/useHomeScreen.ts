import { useState, useEffect, useMemo } from 'react';
import type { Job } from './types';

export function useHomeScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('todos');

  const JOBS_PER_PAGE = 30;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(JOBS_PER_PAGE),
      });

      if (searchTerm) {
        params.append('term', searchTerm);
      }

      try {
        const response = await fetch(`https://apibr.com/vagas/api/v2/issues?${params.toString()}`);
        if (!response.ok) throw new Error('Falha ao buscar dados da API');
        
        const data: Job[] = await response.json();

        const filteredData = data.filter(job => {
          const lowerCaseTitle = job.title.toLowerCase();

          if (lowerCaseTitle.includes('senior') || lowerCaseTitle.includes('sênior')) {
            return false;
          }

          if (lowerCaseTitle.includes('pleno')) {
            return false;
          }

          if (/\b(pl|sr)\b/i.test(lowerCaseTitle)) {
            return false;
          }

          return true;
        });

        setJobs(filteredData);
        setHasNextPage(data.length === JOBS_PER_PAGE);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentPage, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(inputValue);
  };
  
  const getJobInfo = (job: Job): { modality: string; location: string } => {
    let modality = 'Presencial';
    let location = 'Não especificado';
    
    const keywords = job.keywords.map(k => k.toLowerCase());
    
    if (keywords.includes('remoto')) modality = 'Remoto';
    else if (keywords.includes('híbrido')) modality = 'Híbrido';
  
    const locationLabel = job.labels.find(l => l.name.includes('Brasil') || l.name.includes('Nacional'));
    if (locationLabel) location = locationLabel.name;
    
    return { modality, location };
  };

  const displayedJobs = useMemo(() => {
    if (jobTypeFilter === 'todos') {
      return jobs;
    }
    return jobs.filter(job => {
      const { modality } = getJobInfo(job);
      return modality.toLowerCase() === jobTypeFilter;
    });
  }, [jobs, jobTypeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return {
    jobTypeFilter,
    setJobTypeFilter,
    inputValue,
    setInputValue,
    handleSearch,
    loading,
    error,
    jobs,
    displayedJobs,
    getJobInfo,
    formatDate,
    setCurrentPage,
    currentPage,
    hasNextPage,
    searchTerm
  }
};