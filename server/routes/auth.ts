import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Customer from '../models/Customer';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeychangeinproduction';

// Extend Request interface to include user
interface AuthRequest extends Request {
    user?: any;
}

// Middleware to verify token
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// ==========================================
// ADMIN ROUTES (User Collection)
// ==========================================

// ADMIN REGISTER
router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Admin email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            avatar: '/avatars/shadcn.jpg',
            role: 'admin'
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ _id: savedUser._id, role: 'admin' }, JWT_SECRET);

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                avatar: savedUser.avatar,
                role: 'admin'
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// ADMIN LOGIN
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Admin email not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ _id: user._id, role: 'admin' }, JWT_SECRET);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: 'admin'
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// CUSTOMER ROUTES (Customer Collection)
// ==========================================

// CUSTOMER REGISTER
router.post('/customer/signup', async (req: Request, res: Response) => {
    const {
        name, email, password,
        username, mobile, dob, gender,
        city, state, pincode, fullAddress
    } = req.body;

    try {
        // Check if customer email exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) return res.status(400).json({ message: 'Customer email already exists' });

        // Check if username exists
        const existingUsername = await Customer.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: 'Username already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            avatar: '', // Optional or default
            role: 'customer',
            username,
            mobile,
            dob,
            gender,
            city,
            state,
            pincode,
            fullAddress
        });

        const savedCustomer = await newCustomer.save();

        const token = jwt.sign({ _id: savedCustomer._id, role: 'customer' }, JWT_SECRET);

        res.status(201).json({
            token,
            user: {
                id: savedCustomer._id,
                name: savedCustomer.name,
                email: savedCustomer.email,
                role: 'customer',
                // Add other fields to response if needed by frontend immediately
                username: savedCustomer.username
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// CUSTOMER LOGIN
router.post('/customer/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) return res.status(400).json({ message: 'Customer email not found' });

        const validPass = await bcrypt.compare(password, customer.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ _id: customer._id, role: 'customer' }, JWT_SECRET);

        res.json({
            token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                role: 'customer',
                username: customer.username,
                avatar: customer.avatar
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// SHARED / UTILITY ROUTES
// ==========================================

// GET CURRENT USER (Smart Route)
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { _id, role } = req.user;
        let userData: any;

        if (role === 'admin') {
            userData = await User.findById(_id).select('-password');
        } else if (role === 'customer') {
            userData = await Customer.findById(_id).select('-password');
        } else {
            // Fallback/Legacy support if token has no role (shouldn't happen with new logic)
            userData = await User.findById(_id).select('-password');
        }

        if (!userData) return res.status(404).json({ message: 'User not found' });

        // Ensure role is included in response
        const userObj: any = userData.toObject();
        if (!userObj.role) userObj.role = role || 'customer';

        res.json(userObj);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
