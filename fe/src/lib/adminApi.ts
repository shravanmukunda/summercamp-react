import { getAdminToken } from './adminAuth';
import { apiUrl } from '../utils/apiUrl';
import { getErrorMessageFromResponse } from '../utils/parseApiError';

function buildUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return apiUrl(path);
}

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (
    init?.body &&
    typeof init.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(buildUrl(path), { ...init, headers });
}

export async function adminJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await adminFetch(path, init);
  if (!res.ok) {
    throw new Error(await getErrorMessageFromResponse(res));
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
