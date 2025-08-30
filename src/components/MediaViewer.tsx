
import React, { useEffect } from 'react';
import { MediaItem } from '@/pages/Index';
import { X, ChevronLeft, ChevronRight, Download, Share, Heart, Image } from 'lucide-react';

interface MediaViewerProps {
  media: MediaItem;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSetWallpaper?: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ media, onClose, onNext, onPrevious, onSetWallpaper }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors">
          <Heart size={20} className="text-white" />
        </button>
        <button className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors">
          <Share size={20} className="text-white" />
        </button>
        {onSetWallpaper && (
          <button
            onClick={onSetWallpaper}
            className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
            title="Set as Wallpaper"
          >
            <Image size={20} className="text-white" />
          </button>
        )}
        <button className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors">
          <Download size={20} className="text-white" />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Navigation */}
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Media Content */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {media.type === 'image' ? (
          <img
            src={media.url}
            alt={media.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        )}
      </div>

      {/* Media Info */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{media.title}</h3>
        <div className="flex items-center justify-between text-gray-300 text-sm">
          <div className="flex gap-4">
            <span>Collection: {media.collection}</span>
            <span>Type: {media.type}</span>
            <span>Size: {(media.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>
          <div className="flex gap-2">
            {media.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-purple-600/30 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
