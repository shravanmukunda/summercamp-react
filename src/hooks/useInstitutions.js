import { useState, useEffect } from 'react';

export const useInstitutions = (category = null) => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/institutions.json');
        
        if (!response.ok) {
          throw new Error('Failed to load institutions');
        }
        
        const data = await response.json();
        
        // Filter by category if specified
        const filteredData = category 
          ? data.filter(inst => inst.category === category)
          : data;
        
        setInstitutions(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, [category]);

  return { institutions, loading, error };
};
