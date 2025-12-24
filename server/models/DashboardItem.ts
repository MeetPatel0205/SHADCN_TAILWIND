import mongoose, { Document, Schema } from 'mongoose';

export interface IDashboardItem extends Document {
    id: number;
    header: string;
    type: string;
    status: string;
    target?: string;
    limit?: string;
    reviewer?: string;
}

const DashboardItemSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    header: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    target: { type: String, required: false },
    limit: { type: String, required: false },
    reviewer: { type: String, required: false }
});

export default mongoose.model<IDashboardItem>('DashboardItem', DashboardItemSchema);
