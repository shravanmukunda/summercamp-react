import type { InstitutionCategory } from '../types';

import { apiUrl, getApiBaseUrl } from './apiUrl';

export { apiUrl, getApiBaseUrl };

export interface CategoryInfo {
  id: InstitutionCategory;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'music', name: 'Music', icon: '🎵', color: 'purple' },
  { id: 'art', name: 'Art', icon: '🎨', color: 'pink' },
  { id: 'tuition', name: 'Tuition', icon: '📚', color: 'blue' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: 'orange' },
];

export const CITIES: string[] = [
  'Bangalore',
  'Chennai',
  'Delhi',
  'Lucknow',
  'Mumbai',
  'Others',
];

export const SPORTS: string[] = [
  "Athletics",
  "Badminton",
  "Basketball",
  "Boxing",
  "Cricket",
  "Football",
  "Gymnastics",
  "Karate",
  "Swimming",
  "Table Tennis",
  "Tennis",
  "Volleyball",
  "Wrestling"
];

/** Resolved via `VITE_API_BASE_URL` + path (see `apiUrl`). */
export const API_ENDPOINTS = {
  get INSTITUTIONS() {
    return apiUrl('/api/institutions');
  },
  INSTITUTION_DETAIL: (id: string | number): string =>
    apiUrl(`/api/institutions/${encodeURIComponent(String(id))}`),
} as const;

export const APP_CONFIG = {
  NAME: 'Summer Camp React',
  DESCRIPTION: 'Find the best summer camps, music schools, sports academies, and educational institutions.',
  VERSION: '1.0.0',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;
  