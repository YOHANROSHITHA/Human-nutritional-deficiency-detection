import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, mockLogin, setAuth } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from || '/', [location.state]);

  const [email, setEmail] = useState(() => location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const { isAuthenticated } = getAuth();
    if (isAuthenticated) navigate(from, { replace: true });
  }, [from, navigate]);

  const validate = () => {
    const next = {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (!normalizedEmail) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) next.email = 'Enter a valid email address.';

    if (!normalizedPassword) next.password = 'Password is required.';
    else if (normalizedPassword.length < 6) next.password = 'Password must be at least 6 characters.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const auth = await mockLogin({ email, password });
      setAuth(auth);
      showToast('success', 'Login successful.');
      setTimeout(() => navigate(from, { replace: true }), 350);
    } catch (err) {
      console.error(err);
      showToast('error', err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2 items-stretch">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl">
          <div className="absolute -inset-10 bg-primary-600/20 blur-3xl" aria-hidden="true" />
          <div className="relative space-y-4">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Demo Authentication
            </span>
            <h1 className="text-2xl font-bold text-slate-50">Welcome back</h1>
            <p className="text-sm text-slate-300">
              Sign in to continue. This is a frontend-only mock login suitable for your project
              presentation. You can later replace it with a real backend login endpoint.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Demo credentials
              </p>
              <div className="space-y-1 text-sm text-slate-200">
                <p>
                  <span className="text-slate-400">Email:</span> admin@example.com
                </p>
                <p>
                  <span className="text-slate-400">Password:</span> admin123
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Tip: any email + 6+ character password will also work for a “student demo” login.
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Educational tool only. Not a medical diagnosis platform.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-50">Login</h2>
            <p className="text-sm text-slate-400">
              Enter your email and password to access the system.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/40'
                }`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/40'
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <Link to="/" className="hover:text-slate-200">
                ← Back to Home
              </Link>
              <span className="text-slate-500">No registration in demo mode</span>
            </div>
          </form>
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-xl px-4 py-3 text-sm shadow-lg ${
              toast.type === 'error'
                ? 'border border-red-500/40 bg-red-500/10 text-red-200'
                : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;

