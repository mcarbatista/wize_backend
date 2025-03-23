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
            dbName: "wize",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Avoid long buffering errors
            socketTimeoutMS: 45000, // Allow more time for queries
        });

        console.log("✅ MongoDB conectado");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📂 Available Collections in Database:", collections.map(col => col.name)); // Debugging

    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
