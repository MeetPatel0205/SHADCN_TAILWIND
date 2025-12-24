import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

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

// REGISTER
router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            avatar: '/avatars/shadcn.jpg' // Default avatar for now
        });

        const savedUser = await newUser.save();

        // Create token
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);

        res.status(201).json({
            token,
            user: {
                name: savedUser.name,
                email: savedUser.email,
                avatar: savedUser.avatar
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email is not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ _id: user._id }, JWT_SECRET);

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// GET CURRENT USER
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
