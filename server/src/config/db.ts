/**
 * WHAT: Database connection logic.
 * WHY: Centralizes DB connection to support both Atlas and Local URIs.
 */

import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.warn('⚠️ MONGO_URI is not defined in .env');
            return;
        }

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
