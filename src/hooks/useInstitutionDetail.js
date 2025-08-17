// src/hooks/useInstitutionDetail.js
import { useState, useEffect } from 'react';

export const useInstitutionDetail = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('Invalid ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/data/institutions/${id}.json`);
        if (!response.ok) {
          throw new Error(`Institution ${id} not found`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
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
