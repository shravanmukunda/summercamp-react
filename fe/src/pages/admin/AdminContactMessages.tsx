import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchContactMessages, patchContactMessage } from '@/lib/adminEndpoints';

const PAGE_SIZE = 20;

const AdminContactMessages: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterRead, setFilterRead] = useState<boolean | ''>('');

  const params = {
    page,
    page_size: PAGE_SIZE,
    ...(filterRead === '' ? {} : { is_read: filterRead }),
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'messages', params],
    queryFn: () => fetchContactMessages(params),
  });

  const patchMut = useMutation({
    mutationFn: ({ id, is_read }: { id: number; is_read: boolean }) =>
      patchContactMessage(id, is_read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Contact messages</h1>
      <p className="text-slate-600 text-sm mb-6">Inquiries from the public contact form.</p>

      <div className="mb-6">
        <select
          value={filterRead === '' ? '' : filterRead ? 'read' : 'unread'}
          onChange={(e) => {
            setPage(1);
            const v = e.target.value;
            setFilterRead(v === '' ? '' : v === 'read');
          }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="unread">Unread only</option>
          <option value="read">Read only</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p>Loading messages…</p>
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 max-w-xl mb-6">
          <p className="font-medium">Couldn’t load messages</p>
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
          <div className="space-y-4">
            {data.items.map((row) => (
              <article
                key={row.id}
                className={`border rounded-lg p-4 bg-white ${
                  row.is_read ? 'border-slate-200' : 'border-blue-300 ring-1 ring-blue-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{row.name}</div>
                    <div className="text-sm text-slate-600">{row.email}</div>
                    <p className="text-sm text-slate-800 mt-3 whitespace-pre-wrap">
                      {row.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-slate-500">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : ''}
                    </span>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={row.is_read}
                        onChange={(e) =>
                          patchMut.mutate({ id: row.id, is_read: e.target.checked })
                        }
                        disabled={patchMut.isPending}
                      />
                      Mark as read
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 text-sm text-slate-600">
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

export default AdminContactMessages;
