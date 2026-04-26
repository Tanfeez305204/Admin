import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { uploadThumbnail } from "../api/movies.api";

export default function ThumbnailUpload({ value, onUploaded }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");

  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      const response = await uploadThumbnail(file);
      const url = response.data.url;
      setPreviewUrl(url);
      onUploaded(url);
      toast.success("Thumbnail uploaded successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Thumbnail upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = async (files) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    await uploadFile(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-200">Upload Thumbnail</label>

      <div
        className={`rounded-[1.5rem] border-2 border-dashed px-4 py-6 text-center transition sm:rounded-[1.75rem] sm:px-5 sm:py-8 ${
          isDragging ? "border-accent bg-accent/10" : "border-stroke bg-panel"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (event) => {
          event.preventDefault();
          setIsDragging(false);
          await handleFiles(event.dataTransfer.files);
        }}
        role="presentation"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (event) => {
            await handleFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <p className="text-sm leading-6 text-slate-300">
          Drag and drop a poster image here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-accent"
          >
            browse files
          </button>
        </p>
        <p className="mt-2 text-xs text-slate-500">Cloudinary will resize it to 300x450 WebP.</p>

        {isUploading ? <p className="mt-4 text-sm text-slate-300">Uploading thumbnail...</p> : null}
      </div>

      {previewUrl ? (
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-panel sm:max-w-sm">
          <img
            src={previewUrl}
            alt="Thumbnail preview"
            className="h-52 w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
