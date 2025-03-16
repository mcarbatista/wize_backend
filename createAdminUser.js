const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config(); // Load environment variables

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'caritobatista@gmail.com' });
        if (existingUser) {
            console.log('⚠️ User already exists:', existingUser);
            mongoose.connection.close();
            return;
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash('caro1234', 8);
        const user = new User({
            name: 'Wize user test',
            email: 'caritobatista@gmail.com',
            password: hashedPassword,
            role: 'agent',
        });

        await user.save();
        console.log('✅ New User Created:', user);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('❌ MongoDB Error:', err);
        mongoose.connection.close();
    });







const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ MongoDB Connected');

        const email = 'caritobatista@example.com';
        const newPassword = 'NewSecurePassword123!';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found');
            mongoose.connection.close();
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });

        console.log('✅ Password Updated Successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('❌ MongoDB Error:', err);
        mongoose.connection.close();
    });

