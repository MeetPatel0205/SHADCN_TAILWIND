import express, { Request, Response } from 'express';
import DashboardItem from '../models/DashboardItem';

const router = express.Router();

// GET all items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await DashboardItem.find().sort({ id: 1 });
        res.json(items);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// POST new item
router.post('/', async (req: Request, res: Response) => {
    const item = new DashboardItem({
        id: req.body.id,
        header: req.body.header,
        type: req.body.type,
        status: req.body.status,
        target: req.body.target,
        limit: req.body.limit,
        reviewer: req.body.reviewer
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE item
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const item = await DashboardItem.findOne({ id: req.params.id });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (req.body.header) item.header = req.body.header;
        if (req.body.type) item.type = req.body.type;
        if (req.body.status) item.status = req.body.status;
        if (req.body.target) item.target = req.body.target;
        if (req.body.limit) item.limit = req.body.limit;
        if (req.body.reviewer) item.reviewer = req.body.reviewer;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
