import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictByImage } from '../services/api';

const ImageCheck = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await predictByImage(file);
      navigate('/result', { state: { result } });
    } catch (err) {
      setError('Failed to analyze image. Ensure the ML Microservice is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Neural Image Scan</h1>
        <p className="text-slate-500">Upload a clear photo for high-precision AI analysis.</p>
      </div>

      <div className="glass-card p-6 md:p-8 border-white bg-white/80 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center">
          <label className="w-full flex flex-col items-center justify-center h-96 rounded-[2rem] border-2 border-dashed border-primary-200 bg-gradient-to-br from-primary-50/50 to-white transition-all hover:border-primary-500/50 hover:from-primary-50 cursor-pointer group relative overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-[2rem]" />
            ) : (
              <div className="flex flex-col items-center relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-xl shadow-primary-500/10 group-hover:scale-110 transition-transform text-primary-500 border border-primary-100">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-slate-800 font-black text-xl mb-2">Click to upload image</p>
                <p className="text-slate-500 text-sm italic font-medium">JPG, PNG or WEBP (Max 10MB)</p>
              </div>
            )}
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>

          {error && (
            <div className="mt-6 w-full p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="mt-10 flex gap-4 w-full">
            <button
              onClick={() => { setFile(null); setPreview(null); setError(''); }}
              className="btn-secondary h-16 flex-1 text-lg"
              disabled={loading}
            >
              Reset
            </button>
            <button
              onClick={handleUpload}
              className="btn-primary h-16 flex-[2] text-lg"
              disabled={loading || !file}
            >
              {loading ? 'Analyzing Pattern...' : 'Start ML Diagnostic'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ImageCheck;
