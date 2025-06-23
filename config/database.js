const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://garayevanrmnazmp203:nerminazmp203@cluster0.4wy3y62.mongodb.net/personalfinance';
        
        const conn = await mongoose.connect(mongoURI);
        
        console.log(` MongoDB qoşuldu: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB bağlantısında xəta:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;