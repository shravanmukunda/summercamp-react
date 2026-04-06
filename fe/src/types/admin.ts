export interface AnalyticsSummary {
  institutions_total: number;
  institutions_active: number;
  institutions_featured: number;
  applications_pending: number;
  applications_approved: number;
  applications_rejected: number;
  contact_messages_total: number;
  contact_messages_unread: number;
}

export interface InstitutionAdmin {
  id: string;
  name: string;
  category: string;
  city: string;
  area: string;
  rating: number;
  review_count: number;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  programs: unknown[];
  facilities: unknown[];
}

export type PresignMediaKind = 'poster' | 'photo' | 'video' | 'video_poster';

export interface InstitutionMediaPresignPayload {
  kind: PresignMediaKind;
  filename: string;
  content_type: string;
  file_size: number;
}

export interface InstitutionMediaPresignResponse {
  upload_url: string;
  object_key: string;
  headers: Record<string, string>;
}

export interface InstitutionMediaConfirmPayload {
  kind: 'poster' | 'photo' | 'video';
  object_key: string;
  poster_object_key?: string | null;
}

export interface InstitutionMediaAdminItem {
  id: number;
  kind: string;
  url: string;
  webp_url: string | null;
  video_poster_url: string | null;
  video_poster_webp_url: string | null;
}

export interface InstitutionMediaListResponse {
  items: InstitutionMediaAdminItem[];
}

export interface InstitutionAdminListResponse {
  items: InstitutionAdmin[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface ListingApplicationAdmin {
  id: number;
  academy_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  date_established: string | null;
  address: string | null;
  facilities: string[];
  message: string | null;
  website_url: string | null;
  status: ApplicationStatus;
  rejection_reason: string | null;
  created_at: string | null;
}

export interface ListingApplicationListResponse {
  items: ListingApplicationAdmin[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface ContactMessageAdmin {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string | null;
}

export interface ContactMessageListResponse {
  items: ContactMessageAdmin[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface InstitutionAdminCreatePayload {
  id?: string | null;
  name: string;
  category: string;
  city: string;
  area?: string;
  rating?: number;
  review_count?: number;
  description?: string | null;
  image_url?: string | null;
  is_featured?: boolean;
  is_active?: boolean;
  programs?: unknown[];
  facilities?: unknown[];
}

export type InstitutionAdminUpdatePayload = Partial<
  Omit<InstitutionAdminCreatePayload, 'id'>
>;
