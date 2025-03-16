const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const connectDB = async () => {
    console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debugging log
    if (!process.env.MONGO_URI) {
        throw new Error("❌ MONGO_URI is missing! Check your .env file.");
    }
    try {
        console.log("🔍 Connecting to MongoDB with URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
        console.log("🔍 MONGO_URI VALUE:", process.env.MONGO_URI);

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};
module.exports = connectDB;
