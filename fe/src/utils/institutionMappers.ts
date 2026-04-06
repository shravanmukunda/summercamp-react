import type {
  Facility,
  Institution,
  InstitutionCategory,
  InstitutionDetail,
  InstitutionMediaItem,
  Program,
} from '../types';

/** Shape returned by GET /api/institutions (each item) */
export interface ApiInstitutionCard {
  id: string;
  name: string;
  category: string;
  city: string;
  area: string;
  rating: number;
  review_count: number;
  image_url: string | null;
  is_featured: boolean;
}

/** Shape returned by GET /api/institutions/:id */
export interface ApiInstitutionMediaItem {
  id: number;
  kind: 'photo' | 'video';
  url: string;
  webp_url: string | null;
  video_poster_url: string | null;
  video_poster_webp_url: string | null;
}

export interface ApiInstitutionDetail extends ApiInstitutionCard {
  description: string | null;
  programs: unknown[];
  facilities: unknown[];
  poster_url?: string | null;
  poster_webp_url?: string | null;
  media?: ApiInstitutionMediaItem[];
}

const ALLOWED_CATEGORIES: InstitutionCategory[] = ['sports', 'art', 'tuition', 'music'];

function normalizeCategory(raw: string): InstitutionCategory {
  const c = raw.toLowerCase();
  return ALLOWED_CATEGORIES.includes(c as InstitutionCategory) ? (c as InstitutionCategory) : 'sports';
}

function titleCaseCategory(category: string): string {
  if (!category) return 'Institution';
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

export function mapApiCardToInstitution(c: ApiInstitutionCard): Institution {
  const category = normalizeCategory(c.category);
  return {
    id: c.id,
    name: c.name,
    type: titleCaseCategory(c.category),
    category,
    city: c.city,
    area: c.area,
    rating: c.rating,
    reviewCount: c.review_count,
    image: c.image_url ?? '',
    tagline: `${c.name} · ${c.city}`,
    startingPrice: 0,
    sports: undefined,
  };
}

function mapPrograms(programs: unknown[]): Program[] {
  return programs.map((p, i) => {
    if (p && typeof p === 'object' && 'name' in p) {
      const o = p as Record<string, unknown>;
      const levelRaw = o.level;
      const level: Program['level'] =
        levelRaw === 'Intermediate' || levelRaw === 'Advanced' || levelRaw === 'Beginner'
          ? levelRaw
          : 'Beginner';
      return {
        id: typeof o.id === 'number' ? o.id : i + 1,
        name: String(o.name ?? 'Program'),
        description: String(o.description ?? ''),
        duration: String(o.duration ?? ''),
        price: typeof o.price === 'number' ? o.price : Number(o.price) || 0,
        ageGroup: String(o.ageGroup ?? o.age_group ?? ''),
        level,
      };
    }
    return {
      id: i + 1,
      name: 'Program',
      description: '',
      duration: '',
      price: 0,
      ageGroup: '',
      level: 'Beginner' as const,
    };
  });
}

function mapMediaItems(raw: ApiInstitutionMediaItem[] | undefined): InstitutionMediaItem[] {
  if (!raw?.length) return [];
  return raw.map((m) => ({
    id: m.id,
    kind: m.kind,
    url: m.url,
    webpUrl: m.webp_url,
    videoPosterUrl: m.video_poster_url,
    videoPosterWebpUrl: m.video_poster_webp_url,
  }));
}

function mapFacilities(facilities: unknown[]): Facility[] {
  return facilities.map((f, i) => {
    if (f && typeof f === 'object' && 'name' in f) {
      const o = f as Record<string, unknown>;
      return {
        name: String(o.name ?? 'Facility'),
        description: o.description != null ? String(o.description) : undefined,
        icon: o.icon != null ? String(o.icon) : undefined,
      };
    }
    if (typeof f === 'string') {
      return { name: f };
    }
    return { name: `Facility ${i + 1}` };
  });
}

export function mapApiDetailToInstitutionDetail(d: ApiInstitutionDetail): InstitutionDetail {
  const base = mapApiCardToInstitution(d);
  const desc = d.description?.trim() ?? '';
  const firstLine = desc.split('\n')[0]?.trim() ?? '';
  const media = mapMediaItems(d.media ?? []);
  const hero =
    d.poster_webp_url ?? d.poster_url ?? d.image_url ?? '';

  return {
    ...base,
    image: hero || base.image,
    tagline: firstLine.slice(0, 200) || base.tagline,
    description: desc || undefined,
    programs: mapPrograms(d.programs ?? []),
    facilities: mapFacilities(d.facilities ?? []),
    instructors: [],
    posterUrl: d.poster_url ?? null,
    posterWebpUrl: d.poster_webp_url ?? null,
    media,
    gallery: media.filter((m) => m.kind === 'photo').map((m) => m.webpUrl ?? m.url),
    contact: {
      address: [d.area, d.city].filter(Boolean).join(', ') || undefined,
    },
  };
}
