import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  approveListingApplication,
  fetchListingApplications,
  rejectListingApplication,
} from '@/lib/adminEndpoints';
import type { ApplicationStatus } from '@/types/admin';

const PAGE_SIZE = 15;

const AdminApplications: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const params = {
    page,
    page_size: PAGE_SIZE,
    ...(status ? { status } : {}),
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'applications', params],
    queryFn: () => fetchListingApplications(params),
  });

  const approveMut = useMutation({
    mutationFn: (id: number) => approveListingApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      rejectListingApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      setRejectId(null);
      setRejectReason('');
    },
  });

  const handleRejectSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (rejectId == null || !rejectReason.trim()) return;
    rejectMut.mutate({ id: rejectId, reason: rejectReason.trim() });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Listing applications</h1>
      <p className="text-slate-600 text-sm mb-6">
        Review academy submissions. Approving creates a new institution from the application.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus((e.target.value || '') as ApplicationStatus | '');
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p>Loading applications…</p>
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 max-w-xl mb-6">
          <p className="font-medium">Couldn’t load applications</p>
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
                  <th className="px-4 py-3 font-medium">Academy</th>
                  <th className="px-4 py-3 font-medium min-w-[12rem]">Location &amp; details</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">City / category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium w-40" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((row) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{row.academy_name}</div>
                      {row.website_url && (
                        <a
                          href={row.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 break-all"
                        >
                          {row.website_url}
                        </a>
                      )}
                      {row.message && (
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">{row.message}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-xs max-w-sm">
                      {row.date_established && (
                        <div>
                          <span className="text-slate-500">Est. </span>
                          {new Date(row.date_established + 'T12:00:00').toLocaleDateString()}
                        </div>
                      )}
                      {row.address && (
                        <p className="text-slate-600 mt-1 whitespace-pre-wrap break-words">{row.address}</p>
                      )}
                      {row.facilities?.length ? (
                        <ul className="mt-1 list-disc list-inside text-slate-600">
                          {row.facilities.map((f, i) => (
                            <li key={`${row.id}-f-${i}`}>{f}</li>
                          ))}
                        </ul>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{row.contact_name}</div>
                      <div className="text-xs">{row.email}</div>
                      <div className="text-xs">{row.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.city}
                      <div className="text-xs text-slate-500">{row.category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs capitalize ${
                          row.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : row.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {row.status}
                      </span>
                      {row.status === 'rejected' && row.rejection_reason && (
                        <p className="text-xs text-slate-500 mt-1 max-w-[12rem]">
                          {row.rejection_reason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.status === 'pending' && (
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={approveMut.isPending}
                            onClick={() => approveMut.mutate(row.id)}
                            className="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectId(row.id);
                              setRejectReason('');
                            }}
                            className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

      {rejectId != null && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-title"
        >
          <form
            onSubmit={handleRejectSubmit}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 id="reject-title" className="text-lg font-semibold text-slate-900 mb-2">
              Reject application #{rejectId}
            </h2>
            <label className="block text-sm text-slate-700 mb-1">Reason</label>
            <textarea
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4"
            />
            {rejectMut.isError && (
              <p className="text-sm text-red-600 mb-2">
                {rejectMut.error instanceof Error
                  ? rejectMut.error.message
                  : 'Reject failed'}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectId(null)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rejectMut.isPending}
                className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
              >
                {rejectMut.isPending ? 'Submitting…' : 'Reject'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
