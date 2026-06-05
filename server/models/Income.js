import mongoose from 'mongoose';

const incomeSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
  },
  { timestamps: true }
);

const Income = mongoose.model('Income', incomeSchema);
export default Income;
