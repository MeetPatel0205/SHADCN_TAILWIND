const mongoose = require('mongoose');

const DashboardItemSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    header: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    target: { type: String, required: false }, // String to match frontend
    limit: { type: String, required: false },  // String to match frontend
    reviewer: { type: String, required: false }
});

module.exports = mongoose.model('DashboardItem', DashboardItemSchema);
