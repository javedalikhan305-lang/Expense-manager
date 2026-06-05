import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    const expenses = await Expense.find({ user: req.user._id });

    const budgetsWithSpent = budgets.map(b => {
      const budgetObj = b.toObject();
      // Calculate spent: sum expenses matching this category & month
      const spent = expenses
        .filter(e => {
          const expMonth = `${new Date(e.date).getFullYear()}-${String(new Date(e.date).getMonth() + 1).padStart(2, '0')}`;
          return e.category === b.category && expMonth === b.month;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      budgetObj.spent = spent;
      return budgetObj;
    });

    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setBudget = async (req, res) => {
  const { category, limit, month } = req.body;
  try {
    const budget = new Budget({ user: req.user._id, category, limit, month });
    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (budget && budget.user.toString() === req.user._id.toString()) {
      const { category, limit, month } = req.body;
      budget.category = category ?? budget.category;
      budget.limit = limit ?? budget.limit;
      budget.month = month ?? budget.month;
      const updatedBudget = await budget.save();
      res.json(updatedBudget);
    } else {
      res.status(404).json({ message: 'Budget not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (budget && budget.user.toString() === req.user._id.toString()) {
      await budget.deleteOne();
      res.json({ message: 'Budget removed' });
    } else {
      res.status(404).json({ message: 'Budget not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
