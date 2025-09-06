import { useState, useEffect } from 'react';
import type { Institution, InstitutionCategory, LoadingState } from '../types';
import { fetchInstitutions, ApiError } from '../utils/api';

interface UseInstitutionsReturn extends LoadingState {
  institutions: Institution[];
}

export const useInstitutions = (category: InstitutionCategory | null = null): UseInstitutionsReturn => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstitutions = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchInstitutions();
        
        // Filter by category if specified
        const filteredData = category 
          ? data.filter(inst => inst.category === category)
          : data;
        
        setInstitutions(filteredData);
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : 'Failed to load institutions';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, [category]);

  return { institutions, loading, error };
};
