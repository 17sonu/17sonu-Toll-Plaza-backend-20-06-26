const express = require('express');
const Transaction = require('../models/Transaction');
const TollPlaza = require('../models/TollPlaza');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [totalRevenueAgg, todayRevenueAgg, totalVehicles, todayVehicles, plazaCount, revenueByPlaza] =
    await Promise.all([
      Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.countDocuments(),
      Transaction.countDocuments({ createdAt: { $gte: startOfDay } }),
      TollPlaza.countDocuments(),
      Transaction.aggregate([
        { $group: { _id: '$plaza', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $lookup: { from: 'tollplazas', localField: '_id', foreignField: '_id', as: 'plazaInfo' } },
        { $unwind: '$plazaInfo' },
        { $project: { name: '$plazaInfo.name', total: 1, count: 1 } },
        { $sort: { total: -1 } },
      ]),
    ]);

  res.json({
    totalRevenue: totalRevenueAgg[0]?.total || 0,
    todayRevenue: todayRevenueAgg[0]?.total || 0,
    totalVehicles,
    todayVehicles,
    plazaCount,
    revenueByPlaza,
  });
});

module.exports = router;
