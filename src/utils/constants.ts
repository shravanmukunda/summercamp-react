import type { InstitutionCategory } from '../types';

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
  'Ahmedabad',
  'Bangalore',
  'Chennai',
  'Delhi',
  'Hyderabad',
  'Jaipur',
  'Kolkata',
  'Lucknow',
  'Mumbai',
  'Pune',
  'Others',
];

export const API_ENDPOINTS = {
  INSTITUTIONS: '/data/institutions.json',
  INSTITUTION_DETAIL: (id: string | number): string => `/data/institutions/${id}.json`,
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
  