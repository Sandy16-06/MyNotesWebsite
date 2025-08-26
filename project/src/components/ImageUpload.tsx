import React, { useState, useRef } from 'react';
import { X, Upload, Image, Link, Camera } from 'lucide-react';

interface ImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ isOpen, onClose, onUpload }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onUpload(imageUrl.trim());
      setImageUrl('');
      onClose();
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Sample image URLs for quick selection
  const sampleImages = [
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 max-w-2xl w-full scale-in"
        style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image 
              size={24} 
              style={{ color: '#3B82F6', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
            />
            <h2 
              className="text-xl font-bold"
              style={{ color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
            >
              Add Image to Note
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Method Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setUploadMethod('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              uploadMethod === 'url'
                ? 'bg-blue-500/30 border-blue-400/50 text-white'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
            } border`}
          >
            <Link size={18} />
            Image URL
          </button>
          <button
            onClick={() => setUploadMethod('file')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              uploadMethod === 'file'
                ? 'bg-blue-500/30 border-blue-400/50 text-white'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
            } border`}
          >
            <Upload size={18} />
            Upload File
          </button>
        </div>

        {uploadMethod === 'url' ? (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-medium transition-all hover-lift ripple"
                style={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  border: '1px solid rgba(59, 130, 246, 1)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                }}
              >
                Add Image
              </button>
            </form>

            {/* Sample Images */}
            <div>
              <p className="text-sm font-medium text-white/90 mb-3">
                Or choose from sample images:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onUpload(url);
                      onClose();
                    }}
                    className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform border border-white/20 hover:border-white/40"
                  >
                    <img
                      src={url}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? 'border-blue-400 bg-blue-500/20'
                  : 'border-white/30 hover:border-white/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Camera size={48} className="mx-auto mb-4 text-white/60" />
              <p className="text-white/90 mb-2">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-white/60 text-sm mb-4">
                Supports JPG, PNG, GIF up to 10MB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-lg font-medium transition-all hover-lift ripple"
                style={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  border: '1px solid rgba(59, 130, 246, 1)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                }}
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};