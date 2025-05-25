// backend/config/database.js
import mongoose from "mongoose";

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || typeof mongoURI !== 'string' || mongoURI.trim() === '') {
        console.error('---------------------------------------------------------------------');
        console.error('FATAL ERROR: MONGO_URI environment variable is not set or is empty.');
        console.error('Please ensure you have a .env file in the `backend` directory with a valid MONGO_URI,');
        console.error('or that it is correctly set in your deployment environment variables.');
        console.error('Example .env content: MONGO_URI=mongodb+srv://user:pass@cluster.host/dbname?options');
        console.error('---------------------------------------------------------------------');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoURI);
    } catch (error) {
        console.error('---------------------------------------------------------------------');
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Full Error Object:', error);
        console.error('Troubleshooting Tips:');
        console.error('1. Verify your MONGO_URI in .env (or Vercel environment variables).');
        console.error('2. Double-check username/password in the MONGO_URI against MongoDB Atlas > Database Access.');
        console.error('3. Ensure your IP address is whitelisted in MongoDB Atlas > Network Access (use 0.0.0.0/0 for Vercel/cloud).');
        console.error('4. Check your internet connection and if MongoDB Atlas services are operational.');
        console.error('---------------------------------------------------------------------');
        process.exit(1);
    }
};

export default connectDB;