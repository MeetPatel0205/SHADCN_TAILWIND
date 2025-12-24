const express = require('express');
const router = express.Router();
const DashboardItem = require('../models/DashboardItem');

// GET all items
router.get('/', async (req, res) => {
    try {
        const items = await DashboardItem.find().sort({ id: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new item (useful for seeding or adding functionality later)
router.post('/', async (req, res) => {
    const item = new DashboardItem(req.body);
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update item (for updating target, limit, etc.)
router.put('/:id', async (req, res) => {
    try {
        const item = await DashboardItem.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
