import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const next = {};
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');
    const rawConfirm = String(confirmPassword || '');

    if (!trimmedName) next.name = 'Name is required.';

    if (!trimmedEmail) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) next.email = 'Enter a valid email address.';

    if (!rawPassword) next.password = 'Password is required.';
    else if (rawPassword.length < 6)
      next.password = 'Password must be at least 6 characters long.';

    if (!rawConfirm) next.confirmPassword = 'Please confirm your password.';
    else if (rawConfirm !== rawPassword) next.confirmPassword = 'Passwords do not match.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await registerUser({ name, email, password });
      showToast('success', data?.message || 'Registration successful.');
      setTimeout(
        () =>
          navigate('/login', {
            replace: true,
            state: { email: String(email || '').trim().toLowerCase() }
          }),
        400
      );
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to register. Please try again.';
      showToast('error', msg);
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
              Create an account
            </span>
            <h1 className="text-2xl font-bold text-slate-50">
              Register for the Nutrient Deficiency System
            </h1>
            <p className="text-sm text-slate-300">
              Your account details are stored in a JSON file on the Node.js backend. For a real
              deployment you would use a secure database and hashed passwords.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              <li>• Demonstrates full-stack data flow (React → Node → JSON storage).</li>
              <li>• Easy to inspect and present during your final year project demo.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-50">Register</h2>
            <p className="text-sm text-slate-400">
              Fill in the form to create an account for this system.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/40'
                }`}
                placeholder="Your name"
                autoComplete="name"
              />
              {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
            </div>

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
                autoComplete="new-password"
              />
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/40'
                }`}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
              )}
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <Link to="/login" className="hover:text-slate-200">
                Already have an account? Login
              </Link>
              <Link to="/" className="hover:text-slate-200">
                ← Back to Home
              </Link>
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

export default Register;

