'use client';

import { useRef, useState } from 'react';

interface ImageUploadZoneProps {
  images: string[];           // base64 data URLs
  onImagesChange: (imgs: string[]) => void;
}

export function ImageUploadZone({ images, onImagesChange }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFiles = (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).map(
      file =>
        new Promise<string>(resolve => {
          const r = new FileReader();
          r.onload = e => resolve(e.target?.result as string);
          r.readAsDataURL(file);
        }),
    );
    Promise.all(readers).then(results =>
      onImagesChange([...images, ...results]),
    );
  };

  const remove = (idx: number) =>
    onImagesChange(images.filter((_, i) => i !== idx));

  return (
    <div className="img-upload-wrap">
      {/* Drop zone */}
      <div
        className={`img-drop-zone${dragging ? ' drag' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          readFiles(e.dataTransfer.files);
        }}
      >
        <span className="img-drop-icon">📷</span>
        <span className="img-drop-text">اضغط لرفع الصور أو اسحب وأفلت هنا</span>
        <span className="img-drop-hint">JPG, PNG — يمكن رفع أكثر من صورة</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => readFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="img-previews">
          {images.map((src, i) => (
            <div key={i} className="img-preview-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`صورة ${i + 1}`} className="img-preview-thumb" />
              <button
                type="button"
                className="img-preview-remove"
                onClick={() => remove(i)}
                title="حذف الصورة"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
