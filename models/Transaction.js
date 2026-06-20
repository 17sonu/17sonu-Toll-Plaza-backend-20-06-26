const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    plaza: { type: mongoose.Schema.Types.ObjectId, ref: 'TollPlaza', required: true },
    vehicleNumber: { type: String, required: true, uppercase: true, trim: true },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Two-Wheeler', 'Car', 'Bus', 'Truck'],
    },
    amount: { type: Number, required: true, min: 0 },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'FASTag'],
      default: 'FASTag',
    },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  },
  { timestamps: true }
);

transactionSchema.index({ vehicleNumber: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
