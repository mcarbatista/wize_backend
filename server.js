require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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
const propiedadesRoutes = require('./routes/propiedades'); // NEW: Propiedades Route

app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/propiedades', propiedadesRoutes); // NEW: Propiedades API

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
