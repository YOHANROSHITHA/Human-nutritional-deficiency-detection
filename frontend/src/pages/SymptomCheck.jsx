import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictByText } from '../services/api';

const SymptomCheck = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (symptoms.trim().length < 5) {
      setError('Please describe your symptoms in more detail.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await predictByText(symptoms);
      navigate('/result', { state: { result } });
    } catch (err) {
      setError('Failed to analyze symptoms. Ensure the ML Microservice is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">NLP Symptom Analysis</h1>
        <p className="text-slate-400">Describe your symptoms for medical-grade AI mapping.</p>
      </div>

      <div className="glass-card p-8 md:p-12 border-white/5 bg-slate-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-300/5 blur-3xl opacity-50" />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-widest">Your Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => { setSymptoms(e.target.value); setError(''); }}
              placeholder="e.g., I've been feeling extremely tired lately, with noticeable muscle weakness..."
              className="input-field min-h-[240px] resize-none text-lg leading-relaxed placeholder:text-slate-700"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            className="btn-primary w-full text-lg h-16"
            disabled={loading || !symptoms.trim()}
          >
            {loading ? 'Processing Language Engine...' : 'Run AI Diagnostics'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default SymptomCheck;
