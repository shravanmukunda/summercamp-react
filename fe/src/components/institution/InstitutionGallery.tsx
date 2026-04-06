import type { InstitutionMediaItem } from '@/types/institution';

interface InstitutionGalleryProps {
  items: InstitutionMediaItem[];
}

/**
 * Gallery grid for photos and videos. Parent should mount this only when the Gallery tab is active
 * (lazy route/tab) so heavy assets load on demand.
 */
const InstitutionGallery: React.FC<InstitutionGalleryProps> = ({ items }) => {
  if (!items.length) {
    return (
      <p className="text-gray-500 text-center py-8">
        No gallery photos or videos yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) =>
        item.kind === 'photo' ? (
          <figure
            key={item.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm"
          >
            <img
              src={item.webpUrl ?? item.url}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-64 object-cover"
            />
          </figure>
        ) : (
          <figure
            key={item.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-black shadow-sm"
          >
            <video
              controls
              preload="none"
              playsInline
              poster={item.videoPosterWebpUrl ?? item.videoPosterUrl ?? undefined}
              className="w-full aspect-video object-contain bg-black"
            >
              <source src={item.url} type="video/mp4" />
              <source src={item.url} type="video/webm" />
            </video>
          </figure>
        )
      )}
    </div>
  );
};

export default InstitutionGallery;
