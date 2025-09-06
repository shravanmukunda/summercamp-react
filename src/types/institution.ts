export type InstitutionCategory = 'sports' | 'art' | 'tuition' | 'music';

export interface Institution {
  id: number;
  name: string;
  type: string;
  category: InstitutionCategory;
  city: string;
  area: string;
  rating: number;
  reviewCount: number;
  image: string;
  tagline: string;
  startingPrice: number;
}

export interface InstitutionDetail extends Institution {
  description?: string;
  features?: string[];
  schedule?: {
    [key: string]: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
  gallery?: string[];
  programs?: Program[];
  instructors?: Instructor[];
  facilities?: Facility[];
  totalStudents?: number;
  totalInstructors?: number;
  established?: string;
  achievements?: string[];
  policies?: {
    [key: string]: string;
  };
}

export interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  ageGroup: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Instructor {
  name: string;
  specialization: string;
  experience: string;
  qualification: string;
  image?: string;
  bio?: string;
}

export interface Facility {
  name: string;
  description?: string;
  icon?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface SearchFilters {
  category?: InstitutionCategory;
  city?: string;
  area?: string;
  minRating?: number;
  maxPrice?: number;
  searchTerm?: string;
}