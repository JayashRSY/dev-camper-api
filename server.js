const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
// Load env vars
dotenv.config({ path: './config/config.env' });
const logger = require('./middleware/logger');
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
// var cors = require('cors')

// Routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

connectDB();
const app = express();
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Enable CORS
// app.use(cors());

// File uploading
app.use(fileupload());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers to the server
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
})