import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Budget from '../models/Budget.js';
import Notification from '../models/Notification.js';

export const createExpense = async (req, res) => {
  const { amount, category, description, date, receiptUrl } = req.body;
  try {
    const expense = new Expense({ user: req.user._id, amount, category, description, date, receiptUrl });
    const createdExpense = await expense.save();

    // Budget check logic
    const expenseDate = date ? new Date(date) : new Date();
    const month = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
    const budget = await Budget.findOne({ user: req.user._id, category, month });

    if (budget) {
      // Aggregate expenses for this category and month
      const startOfMonth = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
      const endOfMonth = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, 0);

      const expenses = await Expense.aggregate([
        { $match: { user: req.user._id, category, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalSpent = expenses.length > 0 ? expenses[0].total : 0;

      if (totalSpent >= budget.limit) {
        const message = `Alert: You have exceeded your ${category} budget for ${month}!`;
        const notification = new Notification({ user: req.user._id, message, type: 'budget_alert' });
        await notification.save();
        
        if (req.io) {
          req.io.to(req.user._id.toString()).emit('budgetAlert', { message, category, totalSpent, limit: budget.limit });
        }
      } else if (totalSpent >= budget.limit * 0.8) {
        const message = `Warning: You have used ${((totalSpent/budget.limit)*100).toFixed(1)}% of your ${category} budget for ${month}.`;
        const notification = new Notification({ user: req.user._id, message, type: 'budget_warning' });
        await notification.save();
        
        if (req.io) {
          req.io.to(req.user._id.toString()).emit('budgetWarning', { message, category, totalSpent, limit: budget.limit });
        }
      }
    }

    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense && expense.user.toString() === req.user._id.toString()) {
      await expense.deleteOne();
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense && expense.user.toString() === req.user._id.toString()) {
      const { amount, category, description, date, receiptUrl } = req.body;
      expense.amount = amount ?? expense.amount;
      expense.category = category ?? expense.category;
      expense.description = description ?? expense.description;
      expense.date = date ?? expense.date;
      expense.receiptUrl = receiptUrl ?? expense.receiptUrl;
      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
