const express = require('express');
const TollPlaza = require('../models/TollPlaza');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const plazas = await TollPlaza.find().sort({ name: 1 });
  res.json(plazas);
});

router.post('/', async (req, res) => {
  try {
    const plaza = await TollPlaza.create(req.body);
    res.status(201).json(plaza);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const plaza = await TollPlaza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plaza) return res.status(404).json({ message: 'Plaza not found' });
    res.json(plaza);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const plaza = await TollPlaza.findByIdAndDelete(req.params.id);
  if (!plaza) return res.status(404).json({ message: 'Plaza not found' });
  res.json({ message: 'Plaza deleted' });
});

module.exports = router;
