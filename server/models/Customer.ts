import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: 'customer';
    // Profile Fields
    username: string;
    mobile: string;
    dob: Date;
    gender: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: 'customer' },

    // Profile Fields - Required for customers
    username: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    fullAddress: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
