require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express app
const app = express();

// ALLOW MULTIPLE ORIGINS IN ONE CALL
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://wize-frontend.vercel.app"
    ],
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB Atlas
(async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1); // Stop server if DB fails
    }
})();

// Import Routes
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const propiedadesRoutes = require('./routes/propiedades');
const desarrollosRoutes = require('./routes/desarrollos');
// const bootstrapAuthRoutes = require('./routes/bootstrapAuth');
const adminRouter = require("./routes/admin");

// Mount Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/propiedades', propiedadesRoutes);
app.use('/api/desarrollos', desarrollosRoutes);
// app.use('/api/auth', bootstrapAuthRoutes);
app.use("/api/admin", adminRouter);

// Root Route
app.get('/', (req, res) => {
    res.send('✅ API is running...');
});

// Catch All Unhandled Routes
app.use((req, res) => {
    res.status(404).json({ error: '❌ Route Not Found' });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
