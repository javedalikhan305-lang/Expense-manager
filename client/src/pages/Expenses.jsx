import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    fetchExpenses();
  };

  const handleDeleteExpense = (id, label) => {
    setPendingDelete({ id, label });
  };

  const confirmDeleteExpense = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/expenses/${pendingDelete.id}`);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setPendingDelete(null);
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Expenses</h1>
          <p className="text-sm text-fintech-muted mt-1">Track your spending with elegant controls.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-fintech-primary px-5 py-3 text-sm font-bold text-black shadow-yellow transition hover:bg-fintech-primaryDark"
        >
          <Plus size={18} />
          New Transaction
        </button>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />

      <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] shadow-soft overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[#2a2a2a] bg-[#0f0f0f] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fintech-muted" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] py-3 pl-12 pr-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-fintech-muted transition hover:border-fintech-primary hover:text-fintech-primary">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#0f0f0f] text-fintech-muted text-sm uppercase tracking-[0.12em]">
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-fintech-muted">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-fintech-muted">
                    No transactions found. Click "New Transaction" to add one.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((tx) => (
                  <tr key={tx._id || tx.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">{tx.description || tx.title}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-fintech-primary/10 border border-fintech-primary/20 px-3 py-1 text-xs font-semibold text-fintech-primary">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-fintech-muted text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className={`px-6 py-5 text-right font-semibold ${tx.amount > 0 ? 'text-fintech-primary' : 'text-fintech-muted'}`}>
                      ₹{Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDeleteExpense(tx._id, tx.description || tx.category || 'transaction')}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-3xl text-fintech-muted transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete ${pendingDelete?.label || 'this expense'}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteExpense}
        onCancel={() => setPendingDelete(null)}
      />
      </div>
    </div>
  );
};

export default Expenses;
