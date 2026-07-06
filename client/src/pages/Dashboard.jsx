import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Wallet, CreditCard, Plus } from 'lucide-react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';

const COLORS = ['#f5c518', '#e0b000', '#888888', '#555555'];

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-sm text-white shadow-soft">
      <p className="font-semibold">{data.name}</p>
      <p className="text-fintech-muted mt-1">₹{Number(data.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
};

const StatCard = ({ title, amount, icon: Icon, trend, isPositive }) => (
  <div className="bg-[#111111] p-6 rounded-2xl border border-[#2a2a2a] hover:border-fintech-primary/30 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-fintech-primary/10 border border-fintech-primary/20 rounded-xl flex items-center justify-center text-fintech-primary group-hover:bg-fintech-primary/20 transition">
        <Icon size={22} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? 'text-fintech-primary bg-fintech-primary/10' : 'text-fintech-muted bg-white/5'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-fintech-muted text-sm font-medium mb-1">{title}</h3>
      <h2 className="text-2xl font-bold text-white">₹{Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
    </div>
  </div>
);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, incRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/incomes'),
      ]);
      setExpenses(expRes.data);
      setIncomes(incRes.data);
      buildChartData(expRes.data, incRes.data);
      buildPieData(expRes.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildChartData = (expArr, incArr) => {
    const months = {};
    [...expArr].forEach(e => {
      const m = new Date(e.date).toLocaleString('default', { month: 'short' });
      if (!months[m]) months[m] = { name: m, income: 0, expense: 0 };
      months[m].expense += e.amount;
    });
    [...incArr].forEach(i => {
      const m = new Date(i.date).toLocaleString('default', { month: 'short' });
      if (!months[m]) months[m] = { name: m, income: 0, expense: 0 };
      months[m].income += i.amount;
    });
    setChartData(Object.values(months).slice(-7));
  };

  const buildPieData = (expArr) => {
    const cats = {};
    expArr.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + e.amount;
    });
    setPieData(Object.entries(cats).map(([name, value]) => ({ name, value: Math.round(value) })));
  };

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  const recentTx = [...expenses.map(e => ({ ...e, txType: 'expense' })), ...incomes.map(i => ({ ...i, txType: 'income' }))]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-fintech-muted text-sm mt-1">Welcome back! Here's your financial summary.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-fintech-primary hover:bg-fintech-primaryDark text-black px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-yellow"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={fetchData}
      />

      {loading ? (
        <div className="text-center text-fintech-muted py-12">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard title="Total Balance" amount={balance} icon={Wallet} trend={balance >= 0 ? 'Positive' : 'Negative'} isPositive={balance >= 0} />
            <StatCard title="Total Income" amount={totalIncome} icon={IndianRupee} trend="This month" isPositive={true} />
            <StatCard title="Total Expenses" amount={totalExpenses} icon={CreditCard} trend="This month" isPositive={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Area Chart */}
            <div className="lg:col-span-2 bg-[#111111] p-6 rounded-2xl border border-[#2a2a2a]">
              <h2 className="text-lg font-bold text-white mb-6">Income vs Expenses</h2>
              {chartData.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-fintech-muted">No data yet. Add transactions to see chart.</div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5c518" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f5c518" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#555555" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#555555" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                      <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#555" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="income" stroke="#f5c518" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" stroke="#555555" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Pie Chart */}
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#2a2a2a]">
              <h2 className="text-lg font-bold text-white mb-6">Expense Categories</h2>
              {pieData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-fintech-muted">No expenses yet.</div>
              ) : (
                <>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 space-y-2">
                    {pieData.slice(0, 4).map((item, index) => (
                      <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span className="text-fintech-muted">{item.name}</span>
                        </div>
                        <span className="text-white font-semibold">₹{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
              <span className="text-xs text-fintech-muted bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 rounded-full">Last 5</span>
            </div>
            <div className="divide-y divide-[#1f1f1f]">
              {recentTx.length === 0 ? (
                <p className="text-center text-fintech-muted py-8">No transactions yet.</p>
              ) : recentTx.map((tx) => (
                <div key={tx._id} className="px-6 py-4 flex justify-between items-center hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${tx.txType === 'income' ? 'bg-fintech-primary/10 text-fintech-primary' : 'bg-white/5 text-fintech-muted'}`}>
                      {tx.txType === 'income' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.description || tx.source || 'Transaction'}</p>
                      <p className="text-fintech-muted text-xs mt-0.5">{tx.category || tx.source} · {new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.txType === 'income' ? 'text-fintech-primary' : 'text-fintech-muted'}`}>
                    {tx.txType === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
