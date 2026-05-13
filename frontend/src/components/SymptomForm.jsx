import { useState } from 'react';

const SymptomForm = ({ onSubmit, loading }) => {
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }
    if (symptoms.trim().length < 10) {
      setError('Please provide at least 10 characters for better analysis.');
      return;
    }
    setError('');
    onSubmit(symptoms.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg"
    >
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Describe your symptoms
        </label>
        <textarea
          rows={5}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          placeholder='Example: "I feel tired, my gums bleed and my skin looks pale..."'
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <p className="mt-1 text-xs text-slate-400">
          Avoid sharing personal identifiers. This tool is for educational support only and not a
          medical diagnosis.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
        )}
        {loading ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
      </button>
    </form>
  );
};

export default SymptomForm;

