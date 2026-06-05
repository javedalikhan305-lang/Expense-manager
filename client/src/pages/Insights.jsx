import { useState, useEffect, useRef } from 'react';
import { UploadCloud, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const Insights = () => {
  const [dragActive, setDragActive] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const fileInputRef = useRef(null);

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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real financial health score
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const calculateHealthScore = () => {
    if (totalIncome === 0 && totalExpenses === 0) return 0;
    let score = 50; // base score

    // Savings rate contribution (up to +30)
    if (savingsRate >= 30) score += 30;
    else if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 0) score += 5;
    else score -= 10; // spending more than earning

    // Expense diversity - not spending all in one category (+10)
    const categories = [...new Set(expenses.map(e => e.category))];
    if (categories.length >= 3) score += 10;
    else if (categories.length >= 2) score += 5;

    // Income vs expense ratio (+10)
    if (totalIncome > totalExpenses * 1.5) score += 10;
    else if (totalIncome > totalExpenses) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const healthScore = calculateHealthScore();
  const scoreLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : healthScore > 0 ? 'Needs Work' : 'No Data';
  const scoreColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#3b82f6' : healthScore >= 40 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 45; // ~283
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  // Get top spending category
  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  // Fetch AI Insights
  const fetchAiInsights = async () => {
    if (expenses.length === 0) return;
    try {
      setInsightsLoading(true);
      const response = await api.post('/ai/insights', { expenses });
      setAiInsights(response.data.insights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setAiInsights('AI insights could not be generated. Please check your API key configuration.');
    } finally {
      setInsightsLoading(false);
    }
  };

  // Receipt scanning
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processReceiptFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processReceiptFile(files[0]);
    }
  };

  const processReceiptFile = async (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setScanError('Please upload a JPEG, PNG, WebP, or PDF file.');
      return;
    }

    try {
      setScanLoading(true);
      setScanError('');
      setScanResult(null);

      // Convert file to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await api.post('/ai/scan', {
        base64Data,
        mimeType: file.type,
      });

      setScanResult(response.data);
    } catch (error) {
      console.error('Error scanning receipt:', error);
      const serverMessage = error?.response?.data?.message || error?.message;
      const serverDetail = error?.response?.data?.error;
      setScanError(serverDetail ? `${serverMessage}: ${serverDetail}` : serverMessage || 'Failed to scan receipt. Please try again or check your API key.');
    } finally {
      setScanLoading(false);
    }
  };

  const saveScannedExpense = async () => {
    if (!scanResult) return;
    try {
      const parsedAmount = Number(String(scanResult.amount).replace(/[^0-9.]/g, ''));
      await api.post('/expenses', {
        amount: Number.isFinite(parsedAmount) ? parsedAmount : scanResult.amount,
        category: scanResult.category || 'Other',
        description: scanResult.description || 'Scanned receipt',
        date: scanResult.date ? new Date(scanResult.date).toISOString() : new Date().toISOString(),
      });
      setScanResult(null);
      fetchData(); // refresh data
      alert('Expense saved successfully!');
    } catch (error) {
      console.error('Error saving scanned expense:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Insights & Tools</h1>
        <p className="text-gray-400 text-sm mt-1">Smart financial analysis and automated tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Health Score */}
          <div className="bg-fintech-card rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-fintech-primary/20 rounded-xl flex items-center justify-center text-fintech-primary">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Financial Health Score</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading data...
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke={scoreColor}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transform -rotate-90 origin-center transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{healthScore}</span>
                    <span className="text-xs font-medium" style={{ color: scoreColor }}>{scoreLabel}</span>
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  {/* Real savings rate insight */}
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-start gap-3">
                      <TrendingUp className={`flex-shrink-0 mt-0.5 ${savingsRate >= 15 ? 'text-emerald-400' : 'text-yellow-400'}`} size={18} />
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          Savings Rate: {savingsRate.toFixed(1)}%
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          {totalIncome === 0
                            ? 'No income recorded yet. Add your income to track savings.'
                            : savingsRate >= 20
                              ? `Great! You saved ₹${(totalIncome - totalExpenses).toFixed(0)} this period. Keep it up!`
                              : savingsRate >= 0
                                ? `You're saving but try to aim for 20%+ savings rate.`
                                : `You're spending more than you earn. Consider reducing expenses.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top spending category */}
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          {topCategory ? `Top Spending: ${topCategory[0]}` : 'No expenses yet'}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          {topCategory
                            ? `You've spent ₹${topCategory[1].toFixed(0)} on ${topCategory[0]}. ${topCategory[1] > totalExpenses * 0.4 ? 'This is over 40% of your total spending — consider cutting back.' : 'This seems balanced.'}`
                            : 'Add expenses to see spending patterns.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Balance summary */}
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-white font-medium text-sm">Balance Overview</h4>
                        <p className="text-gray-400 text-xs mt-1">
                          Income: ₹{totalIncome.toFixed(0)} | Expenses: ₹{totalExpenses.toFixed(0)} | Net: ₹{(totalIncome - totalExpenses).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI-Powered Insights */}
          <div className="bg-fintech-card rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">AI Analysis</h2>
              </div>
              <button
                onClick={fetchAiInsights}
                disabled={insightsLoading || expenses.length === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {insightsLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Generate Insights
                  </>
                )}
              </button>
            </div>

            {expenses.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">Add some expenses first to get AI-powered insights.</p>
            ) : !aiInsights && !insightsLoading ? (
              <p className="text-gray-500 text-sm py-4">Click "Generate Insights" to get AI-powered financial analysis of your spending.</p>
            ) : insightsLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="animate-spin mr-2" size={20} />
                AI is analyzing your spending patterns...
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiInsights}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Scanner */}
        <div className="lg:col-span-1">
          <div className="bg-fintech-card rounded-2xl border border-gray-800 p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">Smart Receipt Scanner</h2>
            <p className="text-sm text-gray-400 mb-6">Upload a receipt to automatically extract expense details using AI.</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
            />

            <div 
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer ${dragActive ? 'border-fintech-primary bg-fintech-primary/5' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {scanLoading ? (
                <>
                  <Loader2 className="text-fintech-primary mb-4 animate-spin" size={40} />
                  <p className="text-white font-medium mb-1">Scanning receipt...</p>
                  <p className="text-gray-500 text-sm">AI is extracting expense details</p>
                </>
              ) : (
                <>
                  <UploadCloud className="text-gray-500 mb-4" size={40} />
                  <p className="text-white font-medium mb-1">Drag & drop your receipt</p>
                  <p className="text-gray-500 text-sm mb-4">or click to browse files (JPEG, PNG, PDF)</p>
                </>
              )}
            </div>

            {scanError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {scanError}
              </div>
            )}

            {/* Scan Result */}
            {scanResult && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle size={18} />
                  <span className="font-medium text-sm">Receipt Scanned Successfully!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium">₹{scanResult.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-medium">{scanResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Description:</span>
                    <span className="text-white font-medium">{scanResult.description}</span>
                  </div>
                  {scanResult.date && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white font-medium">{scanResult.date}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={saveScannedExpense}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Save Expense
                  </button>
                  <button
                    onClick={() => setScanResult(null)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
