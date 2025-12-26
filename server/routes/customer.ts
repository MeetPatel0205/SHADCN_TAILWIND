import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Customer from '../models/Customer';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeychangeinproduction';

// Middleware to verify token (Simple version, reusing from auth.ts logic if needed, 
// but for now assumming this route is protected or we duplicate verifyToken)
// Ideally we export verifyToken from auth.ts or a middleware file.
// For speed, I'll inline a simple check or assume the frontend handles protection, 
// but backend MUST be secure. Let's add basic verification.

const verifyToken = (req: any, res: Response, next: any) => {
    const rawHeader = req.header('Authorization');
    // console.log("VerifyToken - Header:", rawHeader);
    const token = rawHeader?.replace('Bearer ', '');
    // console.log("VerifyToken - Parsed Token:", token);

    if (!token) return res.status(401).json({ message: 'Access denied - No token' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err: any) {
        console.error("VerifyToken - Error:", err.message, "Token:", token);
        res.status(400).json({ message: 'Invalid token: ' + err.message });
    }
};

// CREATE CUSTOMER (Authenticated)
router.post('/', verifyToken, async (req: any, res: Response) => {
    const {
        name, email, password,
        username, mobile, dob, gender,
        city, state, pincode, fullAddress
    } = req.body;

    try {
        // Build query using $or to check both email and username
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { username }]
        });

        if (existingCustomer) {
            return res.status(400).json({
                message: existingCustomer.email === email ? 'Email already exists' : 'Username already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            role: 'customer',
            username,
            mobile,
            dob,
            gender,
            city,
            state,
            pincode,
            fullAddress,
            createdBy: req.user._id // Link to creator
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// GET ALL CUSTOMERS (Scoped to User)
router.get('/', verifyToken, async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        // Only fetch customers created by this user
        const customers = await Customer.find({ createdBy: userId }).select('-password').sort({ createdAt: -1 });
        res.json(customers);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// GET SINGLE CUSTOMER
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const customer = await Customer.findById(req.params.id).select('-password');
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE CUSTOMER
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE CUSTOMER
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const { password, ...updateData } = req.body;

        // Check for uniqueness excluding current customer
        const existingCustomer = await Customer.findOne({
            $or: [{ email: updateData.email }, { username: updateData.username }],
            _id: { $ne: req.params.id }
        });

        if (existingCustomer) {
            return res.status(400).json({
                message: existingCustomer.email === updateData.email ? 'Email already exists' : 'Username already exists'
            });
        }




        // If password is being updated, hash it
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
