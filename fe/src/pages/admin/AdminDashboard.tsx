import { useQuery } from '@tanstack/react-query';

import { fetchAnalyticsSummary } from '@/lib/adminEndpoints';

const StatCard: React.FC<{ label: string; value: number; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="text-3xl font-semibold text-slate-900 mt-1">{value}</p>
    {hint && <p className="text-xs text-slate-400 mt-2">{hint}</p>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: fetchAnalyticsSummary,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <p>Loading analytics…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 max-w-xl">
        <p className="font-medium">Couldn’t load dashboard</p>
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
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Overview of listings, applications, and inquiries.</p>

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Institutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total" value={data.institutions_total} />
          <StatCard label="Active" value={data.institutions_active} />
          <StatCard label="Featured" value={data.institutions_featured} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Listing applications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pending" value={data.applications_pending} />
          <StatCard label="Approved" value={data.applications_approved} />
          <StatCard label="Rejected" value={data.applications_rejected} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <StatCard label="Total messages" value={data.contact_messages_total} />
          <StatCard label="Unread" value={data.contact_messages_unread} />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
