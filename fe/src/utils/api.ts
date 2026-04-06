import type { Institution, InstitutionDetail } from '../types';
import { API_ENDPOINTS, PAGINATION } from './constants';
import {
  mapApiCardToInstitution,
  mapApiDetailToInstitutionDetail,
  type ApiInstitutionCard,
  type ApiInstitutionDetail,
} from './institutionMappers';
import { getErrorMessageFromResponse } from './parseApiError';
import { apiUrl } from './apiUrl';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

interface InstitutionListResponse {
  items: ApiInstitutionCard[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

/**
 * Loads all pages from GET /api/institutions (up to page_size max per request) for client-side search on Home.
 */
export const fetchInstitutions = async (): Promise<Institution[]> => {
  try {
    const pageSize = Math.min(PAGINATION.MAX_PAGE_SIZE, 50);
    const all: Institution[] = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const url = `${API_ENDPOINTS.INSTITUTIONS}?page=${page}&page_size=${pageSize}`;
      const response = await fetch(url);

      if (!response.ok) {
        const msg = await getErrorMessageFromResponse(response);
        throw new ApiError(
          msg || `Failed to fetch institutions (${response.status})`,
          response.status
        );
      }

      const data: InstitutionListResponse = await response.json();
      all.push(...data.items.map(mapApiCardToInstitution));
      hasNext = data.has_next;
      page += 1;
      if (page > 200) break;
    }

    return all;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error while fetching institutions: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const fetchInstitutionDetail = async (id: string | number): Promise<InstitutionDetail> => {
  try {
    const response = await fetch(API_ENDPOINTS.INSTITUTION_DETAIL(id));

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(`Institution with ID ${id} not found`, 404);
      }
      const msg = await getErrorMessageFromResponse(response);
      throw new ApiError(
        msg || `Failed to fetch institution detail (${response.status})`,
        response.status
      );
    }

    const raw: ApiInstitutionDetail = await response.json();
    return mapApiDetailToInstitutionDetail(raw);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error while fetching institution detail: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export interface ListingApplicationPayload {
  academy_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  /** ISO date string YYYY-MM-DD */
  date_established: string;
  address: string;
  facilities: string[];
  message?: string | null;
  website_url?: string | null;
}

export interface ListingApplicationResponse {
  id: number;
  message: string;
}

export async function submitListingApplication(
  payload: ListingApplicationPayload
): Promise<ListingApplicationResponse> {
  try {
    const body = {
      academy_name: payload.academy_name.trim(),
      contact_name: payload.contact_name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      city: payload.city.trim(),
      category: payload.category.trim(),
      date_established: payload.date_established,
      address: payload.address.trim(),
      facilities: payload.facilities.map((s) => s.trim()).filter(Boolean),
      message: payload.message?.trim() ? payload.message.trim() : null,
      website_url: payload.website_url?.trim() ? payload.website_url.trim() : null,
    };
    const response = await fetch(apiUrl('/api/listing-applications'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const msg = await getErrorMessageFromResponse(response);
      throw new ApiError(msg || `Request failed (${response.status})`, response.status);
    }
    return (await response.json()) as ListingApplicationResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to submit listing application'
    );
  }
}

// Helper function for debounced API calls
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};