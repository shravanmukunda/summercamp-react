import { adminJson } from './adminApi';
import type {
  AnalyticsSummary,
  ContactMessageAdmin,
  ContactMessageListResponse,
  InstitutionAdmin,
  InstitutionAdminCreatePayload,
  InstitutionAdminListResponse,
  InstitutionAdminUpdatePayload,
  InstitutionMediaAdminItem,
  InstitutionMediaConfirmPayload,
  InstitutionMediaListResponse,
  InstitutionMediaPresignPayload,
  InstitutionMediaPresignResponse,
  ListingApplicationAdmin,
  ListingApplicationListResponse,
} from '@/types/admin';

const q = (params: Record<string, string | number | boolean | undefined>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === '') return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  return adminJson('/api/admin/analytics/summary');
}

export function fetchAdminInstitutions(params: {
  is_active?: boolean;
  is_featured?: boolean;
  city?: string;
  category?: string;
  q?: string;
  page?: number;
  page_size?: number;
}): Promise<InstitutionAdminListResponse> {
  return adminJson(`/api/admin/institutions${q(params)}`);
}

export function fetchAdminInstitution(id: string): Promise<InstitutionAdmin> {
  return adminJson(`/api/admin/institutions/${encodeURIComponent(id)}`);
}

export function createAdminInstitution(
  body: InstitutionAdminCreatePayload
): Promise<InstitutionAdmin> {
  return adminJson('/api/admin/institutions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateAdminInstitution(
  id: string,
  body: InstitutionAdminUpdatePayload
): Promise<InstitutionAdmin> {
  return adminJson(`/api/admin/institutions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteAdminInstitution(id: string): Promise<InstitutionAdmin> {
  return adminJson(`/api/admin/institutions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function presignInstitutionMedia(
  institutionId: string,
  body: InstitutionMediaPresignPayload
): Promise<InstitutionMediaPresignResponse> {
  return adminJson(
    `/api/admin/institutions/${encodeURIComponent(institutionId)}/media/presign`,
    { method: 'POST', body: JSON.stringify(body) }
  );
}

export function confirmInstitutionMedia(
  institutionId: string,
  body: InstitutionMediaConfirmPayload
): Promise<InstitutionMediaAdminItem> {
  return adminJson(
    `/api/admin/institutions/${encodeURIComponent(institutionId)}/media/confirm`,
    { method: 'POST', body: JSON.stringify(body) }
  );
}

export function fetchInstitutionMediaList(
  institutionId: string
): Promise<InstitutionMediaListResponse> {
  return adminJson(
    `/api/admin/institutions/${encodeURIComponent(institutionId)}/media`
  );
}

export function deleteInstitutionMedia(
  institutionId: string,
  mediaId: number
): Promise<void> {
  return adminJson(
    `/api/admin/institutions/${encodeURIComponent(institutionId)}/media/${mediaId}`,
    { method: 'DELETE' }
  );
}

export function fetchListingApplications(params: {
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<ListingApplicationListResponse> {
  return adminJson(`/api/admin/listing-applications${q(params)}`);
}

export function fetchListingApplication(
  id: number
): Promise<ListingApplicationAdmin> {
  return adminJson(`/api/admin/listing-applications/${id}`);
}

export function approveListingApplication(
  id: number
): Promise<InstitutionAdmin> {
  return adminJson(`/api/admin/listing-applications/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export function rejectListingApplication(
  id: number,
  reason: string
): Promise<ListingApplicationAdmin> {
  return adminJson(`/api/admin/listing-applications/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function fetchContactMessages(params: {
  is_read?: boolean;
  page?: number;
  page_size?: number;
}): Promise<ContactMessageListResponse> {
  return adminJson(`/api/admin/contact-messages${q(params)}`);
}

export function fetchContactMessage(id: number): Promise<ContactMessageAdmin> {
  return adminJson(`/api/admin/contact-messages/${id}`);
}

export function patchContactMessage(
  id: number,
  is_read: boolean
): Promise<ContactMessageAdmin> {
  return adminJson(`/api/admin/contact-messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read }),
  });
}
