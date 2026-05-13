import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-[#d9d9d9] text-slate-900">
      <section className="grid w-full gap-12 lg:grid-cols-[1.2fr,1fr] items-center relative z-10">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full bg-primary-500/10 px-4 py-1.5 text-xs font-bold text-primary-700 border border-primary-500/20 uppercase tracking-widest">
            Intelligent Health Diagnostics
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Predict Nutrients. <br />
            <span className="text-primary-600 drop-shadow-sm">
              Optimize Health.
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Harness the power of AI to detect deficiencies instantly. 
            Upload an image or describe your symptoms for medical-grade analysis powered by our custom neural networks.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/image-check" className="btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Scan via Image
            </Link>
            <Link to="/symptom-check" className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Describe Symptoms
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
            {[
              { label: 'Deep Learning', desc: 'Xception-based Analysis' },
              { label: 'NLP Engine', desc: 'Symptom Mapping' },
              { label: 'Live Data', desc: '14+ Categories' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 border-slate-200 bg-white shadow-sm">
                <p className="font-bold text-primary-600 text-sm mb-1">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group hidden lg:block">
          <div className="relative glass-card p-8 bg-white border-slate-200 shadow-3xl">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600">AI Diagnostic Engine</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-100" />
                <div className="w-2 h-2 rounded-full bg-slate-100" />
                <div className="w-2 h-2 rounded-full bg-primary-500" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-400">Analysis Confidence</span>
                  <span className="text-primary-600 font-bold">98.2%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full w-[98.2%]" />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-slate-900 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">System Ready</p>
                    <p className="text-xs text-slate-500">Models optimized & connected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
