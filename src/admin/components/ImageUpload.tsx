import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (paths: any) => void;
  currentImage?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, currentImage, label = "Upload Image" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const paths = await res.json();
      onUpload(paths);
      setPreview(paths.original);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 ${preview ? 'border-gold/30 bg-black' : 'border-white/10 bg-white/5 hover:border-gold/50'}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity">
              <Upload size={24} className="text-gold mb-2" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white">Change Image</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-full bg-white/5 text-white/20">
              {isUploading ? <Loader2 size={32} className="animate-spin text-gold" /> : <ImageIcon size={32} />}
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                {isUploading ? 'Processing...' : 'Click to upload'}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-white/20 mt-1">WebP, Max 5MB</p>
            </div>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
};
