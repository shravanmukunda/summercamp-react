/** Parse FastAPI-style `{ "detail": ... }` JSON error bodies. */
export async function getErrorMessageFromResponse(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: unknown };
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => JSON.stringify(d)).join('; ');
    }
    if (data.detail != null) return JSON.stringify(data.detail);
  } catch {
    /* ignore */
  }
  return res.statusText || `HTTP ${res.status}`;
}
