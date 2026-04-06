import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { CATEGORIES } from '@/utils/constants';
import { fetchAdminInstitutions } from '@/lib/adminEndpoints';

const PAGE_SIZE = 20;

const AdminInstitutions: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [isActive, setIsActive] = useState<boolean | ''>('');
  const [isFeatured, setIsFeatured] = useState<boolean | ''>('');

  const params = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      q: q.trim() || undefined,
      category: category || undefined,
      city: city.trim() || undefined,
      is_active: isActive === '' ? undefined : isActive,
      is_featured: isFeatured === '' ? undefined : isFeatured,
    }),
    [page, q, category, city, isActive, isFeatured]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'institutions', params],
    queryFn: () => fetchAdminInstitutions(params),
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institutions</h1>
          <p className="text-slate-600 text-sm mt-1">
            Create, edit, and deactivate listings. Public site only shows active entries.
          </p>
        </div>
        <Link
          to="/admin/institutions/new"
          className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          New institution
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="search"
          placeholder="Search name / description…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => {
            setPage(1);
            setCity(e.target.value);
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select
            value={isActive === '' ? '' : isActive ? 'true' : 'false'}
            onChange={(e) => {
              setPage(1);
              const v = e.target.value;
              setIsActive(v === '' ? '' : v === 'true');
            }}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Active: any</option>
            <option value="true">Active only</option>
            <option value="false">Inactive only</option>
          </select>
          <select
            value={isFeatured === '' ? '' : isFeatured ? 'true' : 'false'}
            onChange={(e) => {
              setPage(1);
              const v = e.target.value;
              setIsFeatured(v === '' ? '' : v === 'true');
            }}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Featured: any</option>
            <option value="true">Featured</option>
            <option value="false">Not featured</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p>Loading institutions…</p>
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 max-w-xl mb-6">
          <p className="font-medium">Couldn’t load institutions</p>
          <p className="text-sm mt-2">
            {error instanceof Error ? error.message : 'Something went wrong.'}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </button>
        </div>
      )}

      {!isLoading && !isError && data && (
        <>
          <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Flags</th>
                  <th className="px-4 py-3 font-medium w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.category}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.city}
                      {row.area ? ` · ${row.area}` : ''}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.rating.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block mr-2 px-2 py-0.5 rounded text-xs ${
                          row.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {row.is_active ? 'active' : 'inactive'}
                      </span>
                      {row.is_featured && (
                        <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-900">
                          featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/institutions/${row.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
            <span>
              Page {data.page} · {data.total} total
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded border border-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!data.has_next}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border border-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminInstitutions;

