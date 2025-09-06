import type { Institution, InstitutionDetail } from '../types';
import { API_ENDPOINTS } from './constants';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchInstitutions = async (): Promise<Institution[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.INSTITUTIONS);
    
    if (!response.ok) {
      throw new ApiError(`Failed to fetch institutions: ${response.status} ${response.statusText}`, response.status);
    }
    
    const data: Institution[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error while fetching institutions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchInstitutionDetail = async (id: string | number): Promise<InstitutionDetail> => {
  try {
    const response = await fetch(API_ENDPOINTS.INSTITUTION_DETAIL(id));
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(`Institution with ID ${id} not found`, 404);
      }
      throw new ApiError(`Failed to fetch institution detail: ${response.status} ${response.statusText}`, response.status);
    }
    
    const data: InstitutionDetail = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error while fetching institution detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function for debounced API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};