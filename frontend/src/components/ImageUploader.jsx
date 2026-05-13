import { useState } from 'react';

const ImageUploader = ({ onSubmit, loading }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setError('');
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    onSubmit(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg"
    >
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Upload a clear image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <p className="mt-1 text-xs text-slate-400">
          Supported formats: JPEG, PNG. Max ~5MB (configurable in backend).
        </p>
      </div>

      {previewUrl && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-300">Preview</span>
          <img
            src={previewUrl}
            alt="Preview"
            className="h-56 w-full rounded-xl object-cover border border-slate-800"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
        )}
        {loading ? 'Analyzing Image...' : 'Analyze Image'}
      </button>
    </form>
  );
};

export default ImageUploader;

