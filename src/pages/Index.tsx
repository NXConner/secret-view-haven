
import React, { useState, useEffect } from 'react';
import { MediaGallery } from '@/components/MediaGallery';
import { MediaViewer } from '@/components/MediaViewer';
import { Sidebar } from '@/components/Sidebar';
import { UploadDropzone } from '@/components/UploadDropzone';
import { SearchBar } from '@/components/SearchBar';
import { Menu, X } from 'lucide-react';
import BackgroundWallpaper, { WallpaperConfig } from '@/components/BackgroundWallpaper';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title: string;
  collection: string;
  tags: string[];
  uploadDate: Date;
  size: number;
}

const Index = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperConfig | null>(null);

  // Mock data for demo purposes
  useEffect(() => {
    const mockData: MediaItem[] = [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80',
        title: 'Personal Photo 1',
        collection: 'favorites',
        tags: ['personal', 'private'],
        uploadDate: new Date(),
        size: 2048000
      },
      {
        id: '2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
        title: 'Personal Photo 2',
        collection: 'recent',
        tags: ['personal', 'work'],
        uploadDate: new Date(),
        size: 1536000
      },
      {
        id: '3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=400&q=80',
        title: 'Personal Photo 3',
        collection: 'favorites',
        tags: ['personal', 'home'],
        uploadDate: new Date(),
        size: 1824000
      }
    ];
    setMediaItems(mockData);
  }, []);

  // Load wallpaper from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wallpaperConfig');
      if (saved) {
        const parsed: WallpaperConfig = JSON.parse(saved);
        if (parsed && parsed.url && (parsed.type === 'image' || parsed.type === 'video')) {
          setWallpaper(parsed);
        }
      }
    } catch {}
  }, []);

  // Persist wallpaper to localStorage
  useEffect(() => {
    try {
      if (wallpaper) {
        localStorage.setItem('wallpaperConfig', JSON.stringify(wallpaper));
      } else {
        localStorage.removeItem('wallpaperConfig');
      }
    } catch {}
  }, [wallpaper]);

  const filteredMedia = mediaItems.filter(item => {
    const matchesCollection = selectedCollection === 'all' || item.collection === selectedCollection;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCollection && matchesSearch;
  });

  const collections = ['all', ...Array.from(new Set(mediaItems.map(item => item.collection)))];

  const handleFileUpload = (files: FileList) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      const newItems: MediaItem[] = Array.from(files).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        title: file.name,
        collection: 'recent',
        tags: ['uploaded'],
        uploadDate: new Date(),
        size: file.size
      }));
      setMediaItems(prev => [...newItems, ...prev]);
      setIsUploading(false);
    }, 2000);
  };

  const handleSetWallpaper = (media: MediaItem) => {
    const config: WallpaperConfig = {
      type: media.type,
      url: media.url,
      objectFit: 'cover',
      opacity: 1,
      blurPx: 0,
      brightness: 1,
      muted: true,
      loop: true,
    };
    setWallpaper(config);
  };

  const handleClearWallpaper = () => setWallpaper(null);

  return (
    <div className="min-h-screen text-white relative">
      <BackgroundWallpaper wallpaper={wallpaper} />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Private Media Vault
            </h1>
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionChange={setSelectedCollection}
          onUpload={() => document.getElementById('file-upload')?.click()}
          onClearWallpaper={handleClearWallpaper}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            {/* Upload Dropzone */}
            <UploadDropzone onFileUpload={handleFileUpload} isUploading={isUploading} />
            
            {/* Media Gallery */}
            <MediaGallery
              mediaItems={filteredMedia}
              onMediaSelect={setSelectedMedia}
            />
          </div>
        </main>
      </div>

      {/* Full-screen Media Viewer */}
      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onNext={() => {
            const currentIndex = filteredMedia.findIndex(item => item.id === selectedMedia.id);
            const nextIndex = (currentIndex + 1) % filteredMedia.length;
            setSelectedMedia(filteredMedia[nextIndex]);
          }}
          onPrevious={() => {
            const currentIndex = filteredMedia.findIndex(item => item.id === selectedMedia.id);
            const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
            setSelectedMedia(filteredMedia[prevIndex]);
          }}
          onSetWallpaper={() => handleSetWallpaper(selectedMedia)}
        />
      )}

      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
    </div>
  );
};

export default Index;
