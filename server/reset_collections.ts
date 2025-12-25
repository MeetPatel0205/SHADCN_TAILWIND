import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Customer from './models/Customer';

dotenv.config();

const resetCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadcn-dashboard');
        console.log('Connected to MongoDB');

        // Drop Users Collection
        try {
            await User.collection.drop();
            console.log('Dropped Users collection');
        } catch (err: any) {
            if (err.code === 26) {
                console.log('Users collection does not exist');
            } else {
                console.error('Error dropping Users collection:', err);
            }
        }

        // Drop Customers Collection
        try {
            await Customer.collection.drop();
            console.log('Dropped Customers collection');
        } catch (err: any) {
            if (err.code === 26) {
                console.log('Customers collection does not exist');
            } else {
                console.error('Error dropping Customers collection:', err);
            }
        }

        console.log('Database reset complete');
        process.exit();

    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

resetCollections();
