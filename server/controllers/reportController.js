import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

export const getReportData = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  try {
    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query).sort({ date: 1 });
    const incomes = await Income.find(query).sort({ date: 1 });
    
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    // Group income by source
    const incomesBySource = incomes.reduce((acc, curr) => {
      acc[curr.source] = (acc[curr.source] || 0) + curr.amount;
      return acc;
    }, {});

    const report = {
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        startDate: startDate || 'All time',
        endDate: endDate || 'All time'
      },
      expensesByCategory,
      incomesBySource,
      transactions: {
        expenses,
        incomes
      }
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};
