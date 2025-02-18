import mongoose from "mongoose";
import debug from "debug";
const log = debug('development:mongoose');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        log(`MongoDB connection FAILED: ${error.message}`);
        console.error('MongoDB connection FAILED:', error.message);
        process.exit(1);
    }
};

export default connectDB;
