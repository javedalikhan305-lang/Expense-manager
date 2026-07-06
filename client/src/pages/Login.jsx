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
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-fintech-text flex items-center justify-center">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-fintech-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] shadow-soft lg:flex-row">
        {/* Left Panel */}
        <div className="hidden flex-1 flex-col justify-center bg-[#0a0a0a] p-10 lg:flex border-r border-[#2a2a2a] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-fintech-primary/5 rounded-full blur-[80px]" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-fintech-primary flex items-center justify-center text-black font-bold text-2xl mb-6 shadow-yellow">
              F
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">Welcome<br />back 👋</h2>
            <p className="mt-4 max-w-sm text-fintech-muted leading-7">
              Securely sign in to manage your budget, track expenses, and view financial insights.
            </p>
            <div className="mt-10 grid gap-3">
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-fintech-primary/30 transition">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-fintech-primary">Fast login</p>
                <p className="mt-2 text-sm text-fintech-muted">Use your email to access your dashboard instantly.</p>
              </div>
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-fintech-primary/30 transition">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-fintech-primary">Secure access</p>
                <p className="mt-2 text-sm text-fintech-muted">Encrypted sessions and safe profile handling.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full flex-1 p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fintech-primary text-black shadow-yellow">
              <span className="font-bold text-xl">F</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Sign in to FinTrack</h2>
            <p className="mt-2 text-sm text-fintech-muted">Your financial workspace starts here.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
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
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-fintech-muted">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-[#2a2a2a] bg-[#1a1a1a] accent-fintech-primary" />
                Remember me
              </label>
              <a href="#" className="text-fintech-primary hover:text-fintech-primaryDark transition">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-fintech-primary px-6 py-4 text-sm font-bold text-black transition hover:bg-fintech-primaryDark shadow-yellow"
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
