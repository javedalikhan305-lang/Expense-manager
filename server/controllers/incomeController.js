import Income from '../models/Income.js';

export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createIncome = async (req, res) => {
  const { source, amount, date, description } = req.body;
  try {
    const income = new Income({ user: req.user._id, source, amount, date, description });
    const createdIncome = await income.save();
    res.status(201).json(createdIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (income && income.user.toString() === req.user._id.toString()) {
      await income.deleteOne();
      res.json({ message: 'Income removed' });
    } else {
      res.status(404).json({ message: 'Income not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (income && income.user.toString() === req.user._id.toString()) {
      const { source, amount, date, description } = req.body;
      income.source = source ?? income.source;
      income.amount = amount ?? income.amount;
      income.description = description ?? income.description;
      income.date = date ?? income.date;
      const updatedIncome = await income.save();
      res.json(updatedIncome);
    } else {
      res.status(404).json({ message: 'Income not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
