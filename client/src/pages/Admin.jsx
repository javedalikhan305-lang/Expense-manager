import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Users, Activity, Database, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Admin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const totalUsers = users.length;
  const activeSessions = 0;
  const systemLoad = '0%';
  const recentSignups = users.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Administration</h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview and user management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-fintech-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-500" size={20} />
            <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
          </div>
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
          <p className="text-xs text-fintech-success mt-1">+{totalUsers} this week</p>
        </div>

        <div className="bg-fintech-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-fintech-success" size={20} />
            <h3 className="text-gray-400 text-sm font-medium">Active Sessions</h3>
          </div>
          <p className="text-2xl font-bold text-white">{activeSessions}</p>
          <p className="text-xs text-gray-500 mt-1">Right now</p>
        </div>

        <div className="bg-fintech-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-purple-500" size={20} />
            <h3 className="text-gray-400 text-sm font-medium">System Load</h3>
          </div>
          <p className="text-2xl font-bold text-white">{systemLoad}</p>
          <p className="text-xs text-gray-500 mt-1">Normal</p>
        </div>

        <div className="bg-fintech-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-fintech-warning" size={20} />
            <h3 className="text-gray-400 text-sm font-medium">Pending Tickets</h3>
          </div>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-xs text-gray-500 mt-1">Requires attention</p>
        </div>
      </div>

      <div className="bg-fintech-card rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Recent User Signups</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-sm border-b border-gray-800">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Date Joined</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading users…
                  </td>
                </tr>
              ) : recentSignups.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No recent users.
                  </td>
                </tr>
              ) : (
                recentSignups.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-white font-medium">{user.name || 'User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.isAdmin ? 'bg-blue-950/60 text-blue-300' : 'bg-gray-800/80 text-gray-300'}`}>
                        {user.isAdmin ? 'Admin' : 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-fintech-muted">Verified</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
