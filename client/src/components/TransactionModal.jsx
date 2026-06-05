import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const TransactionModal = ({ isOpen, onClose, onTransactionAdded }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [budgetCategories, setBudgetCategories] = useState([]);

  const expenseDefaultCategories = ['Food', 'Transport', 'Housing', 'Entertainment'];
  const incomeDefaultCategories = ['Salary', 'Investment'];
  const mergedExpenseCategories = [...new Set([...(budgetCategories.length ? budgetCategories : expenseDefaultCategories), 'Other'])];
  const mergedIncomeCategories = [...new Set([...(budgetCategories.length ? budgetCategories : []), ...incomeDefaultCategories, 'Other'])];

  useEffect(() => {
    const loadBudgetCategories = async () => {
      try {
        const response = await api.get('/budgets');
        const budgets = response.data || [];
        const categories = [...new Set(budgets.map((budget) => budget.category).filter(Boolean))];
        setBudgetCategories(categories);
      } catch (err) {
        console.error('Unable to load budget categories:', err);
      }
    };
    loadBudgetCategories();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'expense' ? '/expenses' : '/incomes';
      const payload = {
        amount: parseFloat(amount),
        description: description || 'No description',
        date,
      };

      if (type === 'income') {
        payload.source = category;
      } else {
        payload.category = category;
      }

      const response = await api.post(endpoint, payload);
      onTransactionAdded(response.data);
      onClose();
      setAmount('');
      setCategory('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-fintech-border bg-[#081722] shadow-soft">
        <div className="flex items-center justify-between gap-4 border-b border-fintech-border bg-[#0b1b30] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Transaction</h2>
            <p className="text-sm text-fintech-muted">Quickly enter income or expense details.</p>
          </div>
          <button onClick={onClose} className="text-fintech-muted transition hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                type === 'expense'
                  ? 'border-fintech-primary bg-fintech-primary text-black'
                  : 'border-fintech-border bg-[#091f34] text-fintech-text hover:border-fintech-primary'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                type === 'income'
                  ? 'border-fintech-primary bg-fintech-primary text-black'
                  : 'border-fintech-border bg-[#091f34] text-fintech-text hover:border-fintech-primary'
              }`}
            >
              Income
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fintech-muted">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] px-12 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Category</label>
              <input
                list="category-options"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                placeholder="Type or select a category"
              />
              <datalist id="category-options">
                {(type === 'expense' ? mergedExpenseCategories : mergedIncomeCategories).map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fintech-muted mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] px-4 py-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
                placeholder="Payment details"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-fintech-primary px-6 py-4 text-sm font-semibold text-black transition hover:bg-fintech-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
