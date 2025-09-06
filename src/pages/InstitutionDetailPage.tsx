// src/pages/InstitutionDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstitutionDetail from '../components/institution/InstitutionDetail';
import type { InstitutionDetail as InstitutionDetailType } from '../types';

const InstitutionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [institutionData, setInstitutionData] = useState<InstitutionDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstitutionData = async (): Promise<void> => {
      if (!id) {
        setError('Invalid institution ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific institution data from public folder
        const response = await fetch(`/data/institutions/${id}.json`);
        
        if (!response.ok) {
          throw new Error(`Institution with ID ${id} not found`);
        }
        
        const data: InstitutionDetailType = await response.json();
        setInstitutionData(data);
        
        // Update page title
        document.title = `${data.name} - EduConnect`;
        
      } catch (err) {
        console.error('Error loading institution data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutionData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading institution details...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="text-6xl text-gray-400 mb-4">🏫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Institution Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render institution details
  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionDetail data={institutionData} />
    </div>
  );
};

export default InstitutionDetailPage;