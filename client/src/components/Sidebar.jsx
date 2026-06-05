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
    <aside className="fixed left-0 top-0 z-20 h-screen w-72 bg-[#071d2f] border-r border-fintech-border flex flex-col">
      <div className="h-20 px-8 flex items-center border-b border-fintech-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-3xl bg-fintech-primary flex items-center justify-center text-black font-bold shadow-soft">
            F
          </div>
          <div>
            <p className="text-lg font-semibold text-white">FinTrack</p>
            <p className="text-sm text-fintech-muted">Expense Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#1c4b7f] text-white shadow-soft'
                  : 'text-fintech-muted hover:text-white hover:bg-[#112637]'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              location.pathname === '/admin'
                ? 'bg-[#1c4b7f] text-white shadow-soft'
                : 'text-fintech-muted hover:text-white hover:bg-[#112637]'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Admin Panel</span>
          </Link>
        )}
      </nav>

      <div className="p-5 border-t border-fintech-border">
        <div className="flex items-center gap-3 px-4 py-4 bg-[#10283c] rounded-3xl">
          <div className="w-10 h-10 bg-[#1e3f66] rounded-full flex items-center justify-center text-fintech-primary font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-fintech-muted">{isAdmin ? 'Admin' : 'Member'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#112637] text-fintech-muted hover:bg-[#14416f] hover:text-white transition"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
