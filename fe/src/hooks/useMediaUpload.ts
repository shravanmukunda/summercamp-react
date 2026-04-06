import { useCallback, useState } from 'react';

import {
  confirmInstitutionMedia,
  presignInstitutionMedia,
} from '@/lib/adminEndpoints';

async function putToR2(
  uploadUrl: string,
  file: File,
  headers: Record<string, string>
): Promise<void> {
  const h = new Headers();
  Object.entries(headers).forEach(([k, v]) => h.set(k, v));
  const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: h });
  if (!res.ok) {
    throw new Error(`Direct upload failed (${res.status})`);
  }
}

export function useMediaUpload(institutionId: string | undefined) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const uploadPoster = useCallback(
    async (file: File) => {
      if (!institutionId) throw new Error('Missing institution');
      setBusy(true);
      setError(null);
      try {
        const presign = await presignInstitutionMedia(institutionId, {
          kind: 'poster',
          filename: file.name,
          content_type: file.type || 'image/jpeg',
          file_size: file.size,
        });
        await putToR2(presign.upload_url, file, presign.headers);
        await confirmInstitutionMedia(institutionId, {
          kind: 'poster',
          object_key: presign.object_key,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Upload failed';
        setError(msg);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [institutionId]
  );

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!institutionId) throw new Error('Missing institution');
      setBusy(true);
      setError(null);
      try {
        const presign = await presignInstitutionMedia(institutionId, {
          kind: 'photo',
          filename: file.name,
          content_type: file.type || 'image/jpeg',
          file_size: file.size,
        });
        await putToR2(presign.upload_url, file, presign.headers);
        await confirmInstitutionMedia(institutionId, {
          kind: 'photo',
          object_key: presign.object_key,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Upload failed';
        setError(msg);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [institutionId]
  );

  const uploadVideo = useCallback(
    async (videoFile: File, posterFile?: File) => {
      if (!institutionId) throw new Error('Missing institution');
      setBusy(true);
      setError(null);
      try {
        const videoType =
          videoFile.type === 'video/webm' ? 'video/webm' : 'video/mp4';
        const vp = await presignInstitutionMedia(institutionId, {
          kind: 'video',
          filename: videoFile.name,
          content_type: videoType,
          file_size: videoFile.size,
        });
        await putToR2(vp.upload_url, videoFile, vp.headers);
        let posterKey: string | undefined;
        if (posterFile) {
          const pp = await presignInstitutionMedia(institutionId, {
            kind: 'video_poster',
            filename: posterFile.name,
            content_type: posterFile.type || 'image/jpeg',
            file_size: posterFile.size,
          });
          await putToR2(pp.upload_url, posterFile, pp.headers);
          posterKey = pp.object_key;
        }
        await confirmInstitutionMedia(institutionId, {
          kind: 'video',
          object_key: vp.object_key,
          poster_object_key: posterKey,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Upload failed';
        setError(msg);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [institutionId]
  );

  return {
    uploadPoster,
    uploadPhoto,
    uploadVideo,
    busy,
    error,
    clearError,
  };
}
