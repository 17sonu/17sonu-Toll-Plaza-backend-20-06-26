const express = require('express');
const Transaction = require('../models/Transaction');
const TollPlaza = require('../models/TollPlaza');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// List transactions, newest first. Supports ?search=, ?plaza=, ?status=
router.get('/', async (req, res) => {
  const { plaza, status, search } = req.query;
  const filter = {};
  if (plaza) filter.plaza = plaza;
  if (status) filter.status = status;
  if (search) filter.vehicleNumber = { $regex: search.toUpperCase(), $options: 'i' };

  const transactions = await Transaction.find(filter)
    .populate('plaza', 'name location')
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(transactions);
});

// Create a toll entry - amount is derived server-side from the plaza's rate table
router.post('/', async (req, res) => {
  try {
    const { plazaId, vehicleNumber, vehicleType, paymentMode } = req.body;

    if (!plazaId || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ message: 'plazaId, vehicleNumber and vehicleType are required' });
    }

    const plaza = await TollPlaza.findById(plazaId);
    if (!plaza) return res.status(404).json({ message: 'Plaza not found' });

    const rateEntry = plaza.rates.find((r) => r.vehicleType === vehicleType);
    if (!rateEntry) {
      return res.status(400).json({ message: `No rate configured for ${vehicleType} at this plaza` });
    }

    const transaction = await Transaction.create({
      plaza: plaza._id,
      vehicleNumber,
      vehicleType,
      amount: rateEntry.rate,
      paymentMode: paymentMode || 'FASTag',
      status: 'Paid',
    });

    const populated = await transaction.populate('plaza', 'name location');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
