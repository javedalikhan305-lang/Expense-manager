import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, TrendingUp, PieChart, Sparkles, Settings, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Income', path: '/income', icon: TrendingUp },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Insights & AI', path: '/insights', icon: Sparkles },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-72 bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="h-20 px-8 flex items-center border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-fintech-primary flex items-center justify-center text-black font-bold text-lg shadow-yellow">
            F
          </div>
          <div>
            <p className="text-lg font-bold text-white">FinTrack</p>
            <p className="text-xs text-fintech-muted">Expense Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-fintech-primary text-black font-bold shadow-yellow'
                  : 'text-fintech-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black opacity-60" />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === '/admin'
                ? 'bg-fintech-primary text-black font-bold shadow-yellow'
                : 'text-fintech-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3 px-4 py-4 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <div className="w-10 h-10 bg-fintech-primary rounded-full flex items-center justify-center text-black font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-fintech-muted">{isAdmin ? 'Admin' : 'Member'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1a] text-fintech-muted hover:bg-fintech-primary hover:text-black transition-all duration-200 font-medium border border-[#2a2a2a]"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
