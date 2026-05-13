import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendReportByEmail } from '../services/api';
import { getAuth } from '../utils/auth';

const ResultCard = ({ result }) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  if (!result) return null;

  const { deficiency, confidence, foods, advice, source } = result;
  
  // Proper confidence calculation
  let confidenceValue = typeof confidence === 'string' ? parseFloat(confidence) : confidence;
  const confidencePercentage = confidenceValue > 1 
    ? Math.round(confidenceValue) 
    : Math.round((confidenceValue ?? 0) * 100);

  const handleSendEmail = async () => {
    const { user, isAuthenticated } = getAuth();
    
    if (!isAuthenticated || !user?.email) {
      setError('Please login first to send report to your email.');
      return;
    }

    try {
      setEmailLoading(true);
      setError('');
      await sendReportByEmail({ email: user.email, result });
      setEmailSent(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send email. Ensure the backend is running.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-10 border-white bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden text-slate-900">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Summary</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Detailed analysis of your nutritional markers.</p>
        </div>
        <div className="flex flex-col md:items-end">
          <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest border border-primary-200">
            {source || 'AI Analysis'}
          </span>
          <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Official Report</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <svg className="w-24 h-24 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
            </svg>
          </div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Potential Deficiency</p>
          <p className="text-5xl font-black text-primary-600 tracking-tight">{deficiency}</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-bold text-primary-600 uppercase">Detection Active</span>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Inference Confidence</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black">{confidencePercentage}</span>
            <span className="text-2xl font-bold text-primary-300">%</span>
          </div>
          <div className="mt-8 space-y-2">
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-400 to-primary-300 rounded-full shadow-[0_0_15px_rgba(77,255,255,0.4)]"
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Model Accuracy Status</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Recommended Dietary Protocol</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {foods?.map((food) => (
            <span
              key={food}
              className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all cursor-default"
            >
              {food}
            </span>
          ))}
        </div>
      </div>

      {advice && (
        <div className="p-8 rounded-[2rem] bg-primary-50 border border-primary-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
            <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] mb-3">Clinical Guidance</p>
          <p className="text-base text-slate-700 leading-relaxed font-semibold italic">"{advice}"</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {emailSent && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold text-center animate-card-in">
          ✓ Report has been sent to your registered email address!
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-8">
        <p className="text-[10px] text-slate-400 font-medium leading-normal italic text-center max-w-2xl">
          Disclaimer: This AI-generated assessment is for educational purposes only. Always consult a healthcare professional for clinical decisions.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Link
            to={result.type === 'text' ? '/symptom-check' : '/image-check'}
            className="btn-secondary h-16 text-sm group flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {result.type === 'text' ? 'New Symptoms' : 'New Scan'}
          </Link>

          <button
            onClick={handleSendEmail}
            disabled={emailLoading || emailSent}
            className={`h-16 rounded-2xl border-2 flex items-center justify-center text-sm font-bold transition-all ${
              emailSent 
                ? 'bg-emerald-500 border-emerald-500 text-white cursor-default'
                : 'border-primary-500 text-primary-700 hover:bg-primary-50 active:scale-95'
            }`}
          >
            {emailLoading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-primary-700/20 border-t-primary-700 rounded-full animate-spin mr-2" />
                Sending...
              </span>
            ) : emailSent ? (
              'Sent to Email ✓'
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Report
              </span>
            )}
          </button>
          
          <Link
            to="/nutrition-guide"
            className="btn-primary h-16 text-sm group shadow-xl flex items-center justify-center"
          >
            Full Guide
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
