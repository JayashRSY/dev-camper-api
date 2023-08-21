const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        // The following options are to prevent warnings in the console
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;