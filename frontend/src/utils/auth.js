const AUTH_TOKEN_KEY = 'nd_auth_token';
const AUTH_USER_KEY = 'nd_auth_user';

export const getAuth = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = localStorage.getItem(AUTH_USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user, isAuthenticated: Boolean(token) };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
};

export const setAuth = ({ token, user }) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user ?? null));
  window.dispatchEvent(new Event('auth:changed'));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event('auth:changed'));
};

// Mock login for frontend demo.
// Later: replace this with a real backend auth API call.
export const mockLogin = async ({ email, password }) => {
  await new Promise((r) => setTimeout(r, 700));

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');

  const demoEmail = 'admin@example.com';
  const demoPassword = 'admin123';

  if (normalizedEmail === demoEmail && normalizedPassword === demoPassword) {
    return {
      token: 'mock-jwt-token',
      user: { name: 'Admin', email: demoEmail, role: 'admin' }
    };
  }

  // Allow any non-empty email/password for "student demo" mode
  if (normalizedEmail && normalizedPassword.length >= 6) {
    return {
      token: 'mock-jwt-token',
      user: { name: 'Student', email: normalizedEmail, role: 'user' }
    };
  }

  const err = new Error('Invalid email or password.');
  err.code = 'INVALID_CREDENTIALS';
  throw err;
};

