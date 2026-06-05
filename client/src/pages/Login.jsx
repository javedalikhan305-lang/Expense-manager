import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '../store/slices/authSlice';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    dispatch(loginStart());
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(loginSuccess(userData));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-dark via-[#081921] to-[#0b1f31] px-4 py-10 text-fintech-text">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-fintech-border bg-[#091820]/90 shadow-soft lg:flex-row">
        <div className="hidden flex-1 flex-col justify-center bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,.15),_transparent_40%),linear-gradient(180deg,_#0f1f34,_#08121f)] p-10 lg:flex">
          <h2 className="text-4xl font-semibold text-white">Welcome back</h2>
          <p className="mt-4 max-w-sm text-fintech-muted leading-7">
            Securely sign in to manage your budget, track expenses, and view financial insights in a clean, business-ready interface.
          </p>
          <div className="mt-10 grid gap-4">
            <div className="rounded-3xl border border-fintech-border bg-[#0c2439]/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-fintech-primary">Fast login</p>
              <p className="mt-3 text-sm text-fintech-muted">Use your email to access your dashboard instantly.</p>
            </div>
            <div className="rounded-3xl border border-fintech-border bg-[#0c2439]/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-fintech-primary">Secure access</p>
              <p className="mt-3 text-sm text-fintech-muted">Encrypted sessions and safe profile handling.</p>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-fintech-primary text-black shadow-soft">
              <span className="font-semibold text-xl">F</span>
            </div>
            <h2 className="text-3xl font-semibold text-white">Sign in to FinTrack</h2>
            <p className="mt-3 text-sm text-fintech-muted">Your financial workspace starts here.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-fintech-muted">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-fintech-border bg-[#091a2b] text-fintech-primary focus:ring-fintech-primary" />
                Remember me
              </label>
              <a href="#" className="text-fintech-primary hover:text-fintech-primaryDark transition">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full rounded-3xl bg-fintech-primary px-6 py-4 text-sm font-semibold text-black transition hover:bg-fintech-primaryDark"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-fintech-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-fintech-primary hover:text-fintech-primaryDark font-semibold">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
