import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ImageCheck from './pages/ImageCheck';
import SymptomCheck from './pages/SymptomCheck';
import NutritionGuide from './pages/NutritionGuide';
import ResultPage from './pages/ResultPage';
import Login from './pages/Login';
import Register from './pages/Register';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-300/50 bg-[#d9d9d9]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-slate-900 font-black text-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            N
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">NutriGuard <span className="text-primary-600">AI</span></span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Intelligence for Health</p>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {[
            { name: 'Home', path: '/' },
            { name: 'Image Scan', path: '/image-check' },
            { name: 'Symptom NLP', path: '/symptom-check' },
            { name: 'Nutrient Guide', path: '/nutrition-guide' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive(link.path) 
                ? 'bg-white/50 text-slate-900' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/30'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-4">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary py-2.5 px-5 text-xs">
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#d9d9d9]">
      <Navbar />
      <div className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-check" element={<ImageCheck />} />
          <Route path="/symptom-check" element={<SymptomCheck />} />
          <Route path="/nutrition-guide" element={<NutritionGuide />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      
      <footer className="border-t border-slate-300 bg-[#d9d9d9] py-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-slate-400 flex items-center justify-center text-slate-800 font-bold text-sm">N</div>
            <span className="text-sm font-bold text-slate-800">NutriGuard AI © 2026</span>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
