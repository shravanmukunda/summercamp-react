import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { adminFetch } from '@/lib/adminApi';
import { setAdminToken } from '@/lib/adminAuth';
import { getErrorMessageFromResponse } from '@/utils/parseApiError';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';

  const [token, setTokenInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    const trimmed = token.trim();
    if (!trimmed) {
      setError('Enter the admin API key.');
      return;
    }
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/analytics/summary', {
        headers: { Authorization: `Bearer ${trimmed}` },
      });
      if (!res.ok) {
        setError(await getErrorMessageFromResponse(res));
        return;
      }
      setAdminToken(trimmed);
      navigate(from.startsWith('/admin') ? from : '/admin/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin sign in</h1>
        <p className="text-sm text-slate-600 mb-6">
          Use the same value as <code className="text-xs bg-slate-100 px-1 rounded">ADMIN_API_KEY</code>{' '}
          on the API server.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-token" className="block text-sm font-medium text-slate-700 mb-1">
              API key
            </label>
            <input
              id="admin-token"
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
