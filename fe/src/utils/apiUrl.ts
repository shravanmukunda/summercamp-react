/**
 * All HTTP calls to the backend must use {@link apiUrl} — no hardcoded hosts or `/api` roots.
 * Set `VITE_API_BASE_URL` in `.env.local` (e.g. `http://localhost:8000`).
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw == null || String(raw).trim() === '') {
    throw new Error(
      'Missing VITE_API_BASE_URL. Add it to fe/.env.local (e.g. VITE_API_BASE_URL=http://localhost:8000).'
    );
  }
  return String(raw).replace(/\/+$/, '');
}

/** Absolute URL for an API path (must start with `/`, e.g. `/api/institutions`). */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
