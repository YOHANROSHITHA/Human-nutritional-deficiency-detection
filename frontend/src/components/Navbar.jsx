import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clearAuth, getAuth } from '../utils/auth';

const navLinkClasses =
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(getAuth().isAuthenticated);

  useEffect(() => {
    const refresh = () => setIsAuthenticated(getAuth().isAuthenticated);
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('auth:changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('auth:changed', refresh);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            ND
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-50">
              Nutrient Deficiency Detector
            </span>
            <span className="text-xs text-slate-400">Final Year CS Project</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? 'bg-primary-600 text-white' : 'text-slate-300'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/image-check"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? 'bg-primary-600 text-white' : 'text-slate-300'}`
            }
          >
            Image
          </NavLink>
          <NavLink
            to="/symptom-check"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? 'bg-primary-600 text-white' : 'text-slate-300'}`
            }
          >
            Symptoms
          </NavLink>
          <NavLink
            to="/nutrition-guide"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? 'bg-primary-600 text-white' : 'text-slate-300'}`
            }
          >
            Guide
          </NavLink>

          <div className="ml-1 hidden sm:block h-6 w-px bg-slate-800" aria-hidden="true" />

          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700 bg-slate-900 text-slate-100 hover:border-red-500/60 hover:text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? 'bg-primary-600 text-white' : 'text-slate-300'}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive ? 'bg-emerald-500 text-white' : 'text-emerald-300'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

