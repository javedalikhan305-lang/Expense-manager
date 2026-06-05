import { useState, useEffect } from 'react';
import { Plus, Target, AlertCircle, Trash2, X } from 'lucide-react';
import api from '../api/axios';

const CATEGORY_COLORS = {
  Food: 'bg-blue-500',
  Transport: 'bg-yellow-500',
  Entertainment: 'bg-purple-500',
  Housing: 'bg-emerald-500',
  Shopping: 'bg-pink-500',
  Health: 'bg-red-500',
  Education: 'bg-cyan-500',
  Utilities: 'bg-orange-500',
  Other: 'bg-gray-500',
};

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: '', limit: '', month: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/budgets', {
        category: formData.category,
        limit: Number(formData.limit),
        month: formData.month,
      });
      setFormData({ category: '', limit: '', month: '' });
      setShowModal(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  // Get current month in YYYY-MM format for default
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-gray-400 text-sm mt-1">Plan and monitor your spending limits</p>
        </div>
        <button
          onClick={() => {
            setFormData({ category: '', limit: '', month: getCurrentMonth() });
            setShowModal(true);
          }}
          className="bg-fintech-primary hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Budget</span>
        </button>
      </div>

      {/* Add Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-fintech-card border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Budget</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-fintech-primary"
                >
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORY_COLORS).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Budget Limit (₹)</label>
                <input
                  type="number"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  required
                  min="1"
                  placeholder="Enter limit amount"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-fintech-primary"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Month</label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-fintech-primary"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-fintech-primary hover:bg-gray-200 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Budget'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No budgets found. Click "New Budget" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => {
            const spent = budget.spent || 0;
            const limit = budget.limit || 0;
            const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            const isOver = spent > limit;
            const isNear = progress >= 85 && !isOver;
            const color = CATEGORY_COLORS[budget.category] || 'bg-gray-500';

            return (
              <div key={budget._id} className="bg-fintech-card rounded-2xl border border-gray-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="text-gray-400" size={20} />
                      <h3 className="text-lg font-medium text-white">{budget.category}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOver && (
                        <div className="flex items-center gap-1 text-fintech-danger text-xs font-medium bg-red-500/10 px-2 py-1 rounded-lg">
                          <AlertCircle size={14} />
                          <span>Over Budget</span>
                        </div>
                      )}
                      {isNear && (
                        <div className="flex items-center gap-1 text-fintech-warning text-xs font-medium bg-yellow-500/10 px-2 py-1 rounded-lg">
                          <AlertCircle size={14} />
                          <span>Near Limit</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteBudget(budget._id)}
                        className="text-gray-600 hover:text-red-400 transition-colors p-1"
                        title="Delete Budget"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs mb-3">Month: {budget.month}</p>

                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-gray-400 text-sm">Spent</p>
                      <p className={`text-2xl font-bold ${isOver ? 'text-fintech-danger' : 'text-white'}`}>
                        ₹{spent.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Limit</p>
                      <p className="text-gray-300 font-medium">₹{limit.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-900 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isOver ? 'bg-fintech-danger' : isNear ? 'bg-fintech-warning' : color}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-2">
                    {progress.toFixed(0)}% used
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budgets;
