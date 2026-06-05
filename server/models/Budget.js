import mongoose from 'mongoose';

const budgetSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    month: { type: String, required: true }, // e.g., '2023-10'
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
