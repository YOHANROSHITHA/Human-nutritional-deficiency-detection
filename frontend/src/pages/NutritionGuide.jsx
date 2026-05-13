import { useEffect, useState } from 'react';
import { getFoodsByNutrient } from '../services/api';

const NUTRIENTS = [
  { key: 'vitamin_a', label: 'Vitamin A', color: 'from-orange-500 to-amber-500', icon: '🥕' },
  { key: 'vitamin_b', label: 'Vitamin B', color: 'from-sky-500 to-cyan-500', icon: '🥚' },
  { key: 'vitamin_c', label: 'Vitamin C', color: 'from-lime-500 to-emerald-500', icon: '🍊' },
  { key: 'iron', label: 'Iron', color: 'from-red-500 to-rose-500', icon: '🥩' },
  { key: 'zinc', label: 'Zinc', color: 'from-indigo-500 to-blue-500', icon: '🥜' },
  { key: 'calcium', label: 'Calcium', color: 'from-slate-400 to-slate-200', icon: '🥛' },
  { key: 'iodine', label: 'Iodine', color: 'from-violet-500 to-purple-500', icon: '🧂' }
];

const NutritionGuide = () => {
  const [foods, setFoods] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError('');
        const entries = await Promise.all(
          NUTRIENTS.map(async (nutrient) => {
            try {
              const data = await getFoodsByNutrient(nutrient.key);
              return [nutrient.key, data.foods || []];
            } catch (err) {
              console.error(err);
              return [nutrient.key, []];
            }
          })
        );
        setFoods(Object.fromEntries(entries));
      } catch (err) {
        console.error(err);
        setError('Failed to load nutrition guide. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nutrition Encyclopedia</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Detailed reference guide for key nutrients and their primary food sources. 
          Use this to optimize your dietary intake based on AI diagnostics.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center justify-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Database...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NUTRIENTS.map((nutrient, index) => (
            <div
              key={nutrient.key}
              className="animate-card-in glass-card p-6 border-slate-100 bg-white hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-500/5 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {nutrient.icon}
                </div>
                <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${nutrient.color}`} />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Nutrient Marker
                  </p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{nutrient.label}</p>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-3">
                    Top Source Foods
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {foods[nutrient.key]?.length ? (
                      foods[nutrient.key].map((food) => (
                        <span
                          key={food}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 hover:bg-white hover:border-primary-100 hover:text-primary-600 transition-all cursor-default"
                        >
                          {food}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-300 italic text-xs">Awaiting data...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default NutritionGuide;
