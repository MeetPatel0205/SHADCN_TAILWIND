require('dotenv').config();
const mongoose = require('mongoose');
const DashboardItem = require('./models/DashboardItem');
const fs = require('fs');
const path = require('path');

// Read data from the original JSON file
const dataPath = path.join(__dirname, '../src/Pages/data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadcn-dashboard')
    .then(async () => {
        console.log('Connected to MongoDB for seeding');

        try {
            await DashboardItem.deleteMany({}); // Clear existing data
            console.log('Cleared existing data');

            await DashboardItem.insertMany(data);
            console.log(`Seeded ${data.length} items successfully`);
        } catch (err) {
            console.error('Error seeding data:', err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));
