const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: true,
      enum: ['Two-Wheeler', 'Car', 'Bus', 'Truck'],
    },
    rate: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const tollPlazaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rates: {
      type: [rateSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TollPlaza', tollPlazaSchema);
