// src/hooks/useInstitutionDetail.ts
import { useState, useEffect } from 'react';
import type { InstitutionDetail, LoadingState } from '../types';
import { fetchInstitutionDetail, ApiError } from '../utils/api';

interface UseInstitutionDetailReturn extends LoadingState {
  data: InstitutionDetail | null;
}

export const useInstitutionDetail = (id: string | number | undefined): UseInstitutionDetailReturn => {
  const [data, setData] = useState<InstitutionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!id) {
        setError('Invalid ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchInstitutionDetail(id);
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : 'Failed to load institution details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { data, loading, error };
};

// Usage in component:
// const { data, loading, error } = useInstitutionDetail(id);
