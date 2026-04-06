import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React from 'react';

import InstitutionMediaPanel from '@/components/admin/InstitutionMediaPanel';
import {
  createAdminInstitution,
  deleteAdminInstitution,
  fetchAdminInstitution,
  updateAdminInstitution,
} from '@/lib/adminEndpoints';
import type { InstitutionAdminCreatePayload } from '@/types/admin';
import { CATEGORIES } from '@/utils/constants';

function parseJsonField(raw: string, fallback: unknown[]): unknown[] {
  const t = raw.trim();
  if (!t) return fallback;
  try {
    const v = JSON.parse(t) as unknown;
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

const emptyForm: InstitutionAdminCreatePayload = {
  name: '',
  category: 'sports',
  city: '',
  area: '',
  rating: 0,
  review_count: 0,
  description: '',
  image_url: '',
  is_featured: false,
  is_active: true,
  programs: [],
  facilities: [],
};

const AdminInstitutionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<InstitutionAdminCreatePayload>(emptyForm);
  const [programsJson, setProgramsJson] = useState('[]');
  const [facilitiesJson, setFacilitiesJson] = useState('[]');
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'institution', id],
    queryFn: () => fetchAdminInstitution(id!),
    enabled: !isNew && Boolean(id),
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      name: data.name,
      category: data.category,
      city: data.city,
      area: data.area,
      rating: data.rating,
      review_count: data.review_count,
      description: data.description ?? '',
      image_url: data.image_url ?? '',
      is_featured: data.is_featured,
      is_active: data.is_active,
      programs: data.programs,
      facilities: data.facilities,
    });
    setProgramsJson(JSON.stringify(data.programs ?? [], null, 2));
    setFacilitiesJson(JSON.stringify(data.facilities ?? [], null, 2));
  }, [data]);

  const createMut = useMutation({
    mutationFn: () =>
      createAdminInstitution({
        ...form,
        programs: parseJsonField(programsJson, []),
        facilities: parseJsonField(facilitiesJson, []),
        description: form.description || null,
        image_url: form.image_url || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      navigate('/admin/institutions');
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const updateMut = useMutation({
    mutationFn: () =>
      updateAdminInstitution(id!, {
        ...form,
        programs: parseJsonField(programsJson, []),
        facilities: parseJsonField(facilitiesJson, []),
        description: form.description || null,
        image_url: form.image_url || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      navigate('/admin/institutions');
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deactivateMut = useMutation({
    mutationFn: () => deleteAdminInstitution(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      navigate('/admin/institutions');
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setFormError(null);
    if (isNew) {
      createMut.mutate();
    } else {
      updateMut.mutate();
    }
  };

  if (!isNew && isError) {
    return (
      <div className="max-w-3xl">
        <Link to="/admin/institutions" className="text-sm text-blue-600 hover:underline">
          ← Back to institutions
        </Link>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-medium">Couldn’t load institution</p>
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
      </div>
    );
  }

  if (!isNew && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <p>Loading institution…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link to="/admin/institutions" className="text-sm text-blue-600 hover:underline">
          ← Back to institutions
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          {isNew ? 'New institution' : 'Edit institution'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">City</span>
            <input
              required
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Area / neighborhood</span>
            <input
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Rating</span>
            <input
              type="number"
              step="0.1"
              min={0}
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: parseFloat(e.target.value) || 0 }))
              }
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Review count</span>
            <input
              type="number"
              min={0}
              value={form.review_count}
              onChange={(e) =>
                setForm((f) => ({ ...f, review_count: parseInt(e.target.value, 10) || 0 }))
              }
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Image URL</span>
            <input
              type="url"
              value={form.image_url ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              rows={4}
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 font-sans"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
            />
            <span className="text-sm text-slate-700">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            <span className="text-sm text-slate-700">Active (visible on public site)</span>
          </label>
        </div>

        <div>
          <span className="text-sm font-medium text-slate-700">Programs (JSON array)</span>
          <textarea
            value={programsJson}
            onChange={(e) => setProgramsJson(e.target.value)}
            rows={6}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-xs"
          />
        </div>
        <div>
          <span className="text-sm font-medium text-slate-700">Facilities (JSON array)</span>
          <textarea
            value={facilitiesJson}
            onChange={(e) => setFacilitiesJson(e.target.value)}
            rows={6}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-xs"
          />
        </div>

        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2 items-center">
          <button
            type="submit"
            disabled={createMut.isPending || updateMut.isPending}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {createMut.isPending || updateMut.isPending ? 'Saving…' : 'Save'}
          </button>
          <Link
            to="/admin/institutions"
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          {!isNew && (
            <button
              type="button"
              disabled={deactivateMut.isPending}
              onClick={() => {
                if (
                  typeof window !== 'undefined' &&
                  window.confirm(
                    'Deactivate this listing? It will be hidden from the public site.'
                  )
                ) {
                  deactivateMut.mutate();
                }
              }}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 ml-auto"
            >
              {deactivateMut.isPending ? 'Deactivating…' : 'Deactivate listing'}
            </button>
          )}
        </div>
      </form>

      {!isNew && id ? (
        <div className="mt-8">
          <InstitutionMediaPanel institutionId={id} />
        </div>
      ) : null}
    </div>
  );
};

export default AdminInstitutionForm;
