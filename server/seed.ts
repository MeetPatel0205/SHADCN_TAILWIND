import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import DashboardItem from './models/DashboardItem';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadcn-dashboard')
    .then(() => {
        console.log('Connected to MongoDB');
        seedData();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

const seedData = async () => {
    try {
        // Read data.json
        // Assuming data.json is in ../src/Pages/data.json relative to server root
        // Adjust path if necessary based on your folder structure
        const dataPath = path.join(__dirname, '..', 'src', 'Pages', 'data.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const items = JSON.parse(rawData);

        // Clear existing data
        await DashboardItem.deleteMany({});
        console.log('Cleared existing data');

        // Insert new data
        await DashboardItem.insertMany(items);
        console.log(`Seeded ${items.length} items`);

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};
