import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useMediaUpload } from '@/hooks/useMediaUpload';
import {
  deleteInstitutionMedia,
  fetchInstitutionMediaList,
} from '@/lib/adminEndpoints';

interface InstitutionMediaPanelProps {
  institutionId: string;
}

const InstitutionMediaPanel: React.FC<InstitutionMediaPanelProps> = ({
  institutionId,
}) => {
  const queryClient = useQueryClient();
  const posterInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const videoPosterInput = useRef<HTMLInputElement>(null);

  const { uploadPoster, uploadPhoto, uploadVideo, busy, error, clearError } =
    useMediaUpload(institutionId);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'institution', institutionId, 'media'],
    queryFn: () => fetchInstitutionMediaList(institutionId),
  });

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'institution'] });
  };

  const handleDelete = async (mediaId: number): Promise<void> => {
    if (!window.confirm('Remove this media item from storage and the database?')) return;
    try {
      await deleteInstitutionMedia(institutionId, mediaId);
      invalidate();
      await refetch();
    } catch {
      /* Error surfaced via adminJson */
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-6 space-y-6 bg-slate-50/50">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Hero &amp; gallery (R2)</h2>
        <p className="text-sm text-slate-600 mt-1">
          Optional hero poster and gallery assets. Configure Cloudflare R2 credentials in the backend{' '}
          <code className="text-xs bg-slate-100 px-1 rounded">.env</code> to enable uploads.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}{' '}
          <button type="button" onClick={clearError} className="text-blue-600 underline">
            Dismiss
          </button>
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          ref={posterInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f)
              void uploadPoster(f).then(() => {
                invalidate();
                void refetch();
              });
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => posterInput.current?.click()}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Upload hero poster
        </button>

        <input
          ref={photoInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f)
              void uploadPhoto(f).then(() => {
                invalidate();
                void refetch();
              });
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => photoInput.current?.click()}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Add gallery photo
        </button>

        <input
          ref={videoInput}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={(e) => {
            const vf = e.target.files?.[0];
            e.target.value = '';
            if (!vf) return;
            const poster = videoPosterInput.current?.files?.[0];
            void uploadVideo(vf, poster).then(() => {
              if (videoPosterInput.current) videoPosterInput.current.value = '';
              invalidate();
              void refetch();
            });
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => videoInput.current?.click()}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Add gallery video
        </button>
      </div>

      <div className="rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Video thumbnail (optional): </span>
        <input
          ref={videoPosterInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-xs max-w-full"
        />
        <p className="text-xs text-slate-500 mt-1">
          Choose a frame image first if you want a custom poster; then click &quot;Add gallery
          video&quot; and select the video file.
        </p>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading media…</p>}

      {data && data.items.length > 0 && (
        <ul className="space-y-2">
          {data.items.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 rounded-md p-3 bg-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-medium uppercase text-slate-500 w-16 shrink-0">
                  {m.kind}
                </span>
                {m.kind === 'poster' || m.kind === 'photo' ? (
                  <img
                    src={m.webp_url ?? m.url}
                    alt=""
                    className="h-12 w-20 object-cover rounded border border-slate-100"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={m.url}
                    muted
                    preload="none"
                    poster={m.video_poster_webp_url ?? m.video_poster_url ?? undefined}
                    className="h-12 w-20 object-cover rounded border border-slate-100 bg-black"
                  />
                )}
                <span className="text-xs text-slate-600 truncate max-w-[14rem]">{m.url}</span>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(m.id)}
                className="text-xs text-red-600 hover:underline shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstitutionMediaPanel;
