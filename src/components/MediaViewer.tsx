
import React, { useEffect } from 'react';
import { MediaItem } from '@/pages/Index';
import { X, ChevronLeft, ChevronRight, Download, Share, Heart, Image } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MediaViewerProps {
  media: MediaItem;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSetWallpaper?: () => void;
  onUpdateMeta?: (update: { id: string; title?: string; collection?: string; tags?: string[] }) => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ media, onClose, onNext, onPrevious, onSetWallpaper, onUpdateMeta }) => {
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

  const [isEditing, setIsEditing] = React.useState(false)
  const [title, setTitle] = React.useState(media.title)
  const [collection, setCollection] = React.useState(media.collection)
  const [tags, setTags] = React.useState(media.tags.join(', '))

  useEffect(() => {
    setTitle(media.title)
    setCollection(media.collection)
    setTags(media.tags.join(', '))
  }, [media])

  const submitEdit = () => {
    if (!onUpdateMeta) return
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean)
    onUpdateMeta({ id: media.id, title: title.trim() || media.title, collection: collection.trim() || 'recent', tags: parsedTags })
    setIsEditing(false)
  }

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
        {onUpdateMeta && (
          <button
            onClick={() => setIsEditing((v) => !v)}
            className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
            title={isEditing ? 'Close Editor' : 'Edit Metadata'}
          >
            <span className="text-white text-sm">{isEditing ? 'Done' : 'Edit'}</span>
          </button>
        )}
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

      {/* Media Info + Editor */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
        {!isEditing ? (
          <>
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
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Collection</label>
              <Input value={collection} onChange={(e) => setCollection(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Tags (comma separated)</label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button size="sm" onClick={submitEdit}>Save</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
