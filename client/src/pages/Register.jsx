import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '../store/slices/authSlice';
import api from '../api/axios';

const Register = () => {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(loginSuccess(userData));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-fintech-text flex items-center justify-center">
      {/* Background glow */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[300px] bg-fintech-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] shadow-soft lg:flex-row">
        {/* Left Panel */}
        <div className="hidden flex-1 flex-col justify-center bg-[#0a0a0a] p-10 lg:flex border-r border-[#2a2a2a] relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-fintech-primary/5 rounded-full blur-[80px]" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-fintech-primary flex items-center justify-center text-black font-bold text-2xl mb-6 shadow-yellow">
              F
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">Build your<br />finances right 🚀</h2>
            <p className="mt-4 max-w-sm text-fintech-muted leading-7">
              Create an account to start tracking expenses, saving smarter, and unlocking AI-powered insights.
            </p>
            <div className="mt-10 grid gap-3">
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-fintech-primary/30 transition">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-fintech-primary">Easy setup</p>
                <p className="mt-2 text-sm text-fintech-muted">Get your dashboard ready in minutes.</p>
              </div>
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-fintech-primary/30 transition">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-fintech-primary">Trusted data</p>
                <p className="mt-2 text-sm text-fintech-muted">Your financial data stays private and secure.</p>
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
            <h2 className="text-3xl font-bold text-white">Create your FinTrack account</h2>
            <p className="mt-2 text-sm text-fintech-muted">Sign up to start managing your income, expenses, and budgets.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                placeholder="John Doe"
                required
              />
            </div>
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
            <button
              type="submit"
              className="w-full rounded-xl bg-fintech-primary px-6 py-4 text-sm font-bold text-black transition hover:bg-fintech-primaryDark shadow-yellow"
            >
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-fintech-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-fintech-primary hover:text-fintech-primaryDark font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
