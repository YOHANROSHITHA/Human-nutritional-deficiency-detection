import { useLocation, useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-xl font-semibold text-slate-50 mb-2">No result to display</h1>
          <p className="text-sm text-slate-400 mb-4">
            Please analyze an image or symptoms first to see mock prediction results.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/image-check')}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Check by Image
            </button>
            <button
              onClick={() => navigate('/symptom-check')}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-primary-500/80"
            >
              Check by Symptoms
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ResultCard result={result} />
    </main>
  );
};

export default ResultPage;

