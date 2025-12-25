import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: 'admin' | 'customer';
    // Profile Fields
    username?: string;
    mobile?: string;
    dob?: Date;
    gender?: string;
    city?: string;
    state?: string;
    pincode?: string;
    fullAddress?: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },

    // Optional Profile Fields
    username: { type: String },
    mobile: { type: String },
    dob: { type: Date },
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    fullAddress: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
