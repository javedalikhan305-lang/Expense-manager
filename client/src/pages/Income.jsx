import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';

const Income = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/incomes');
      setIncomes(res.data);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleTransactionAdded = () => {
    fetchIncomes();
    setIsModalOpen(false);
  };

  const handleDeleteIncome = (id, label) => {
    setPendingDelete({ id, label });
  };

  const confirmDeleteIncome = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/incomes/${pendingDelete.id}`);
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
    } finally {
      setPendingDelete(null);
    }
  };

  const filteredIncomes = incomes.filter((inc) =>
    inc.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Income</h1>
          <p className="text-sm text-fintech-muted mt-1">Manage incoming funds and salary records.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-3xl bg-fintech-primary px-5 py-3 text-sm font-semibold text-black shadow-soft transition hover:bg-fintech-primaryDark"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          New Income
        </button>
      </div>

      <div className="bg-[#0b1d31] rounded-[2rem] border border-fintech-border shadow-soft overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-fintech-border bg-[#071822]/90 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fintech-muted" size={18} />
            <input
              type="text"
              placeholder="Search income..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border border-fintech-border bg-[#091a2b] py-3 pl-12 pr-4 text-fintech-text outline-none transition focus:border-fintech-primary focus:ring-2 focus:ring-fintech-primary/20"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl border border-fintech-border bg-[#091a2b] px-4 py-3 text-sm text-fintech-muted transition hover:border-fintech-primary hover:text-white">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#071822] text-fintech-muted text-sm uppercase tracking-[0.12em]">
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fintech-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-fintech-muted">Loading incomes…</td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-fintech-muted">No incomes found. Click "New Income" to add one.</td>
                </tr>
              ) : (
                filteredIncomes.map((tx) => (
                  <tr key={tx._id || tx.id} className="hover:bg-[#091f31] transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">{tx.source || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-fintech-muted text-sm">{tx.description || '-'}</p>
                    </td>
                    <td className="px-6 py-5 text-fintech-muted text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-right font-semibold text-fintech-primary">+₹{Number(tx.amount).toFixed(2)}</td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDeleteIncome(tx._id, tx.source || 'income')}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-3xl text-fintech-muted transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete Income"
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
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTransactionAdded={handleTransactionAdded}
        />
      )}
      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete Income"
        message={`Are you sure you want to delete ${pendingDelete?.label || 'this income'}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteIncome}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Income;
