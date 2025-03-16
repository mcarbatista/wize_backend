const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const connectDB = async () => {
    console.log("🔍 MONGO_URI:", process.env.MONGO_URI || "⚠️ Not Found"); // Debugging log

    if (!process.env.MONGO_URI) {
        throw new Error("❌ MONGO_URI is missing! Check your .env file.");
    }

    try {
        console.log("🔍 Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected Successfully");
        console.log("🔍 Using MONGO_URI:", process.env.MONGO_URI);

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
