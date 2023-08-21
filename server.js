const express = require("express");
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
// Routes files
const bootcamps = require('./routes/bootcamps');
// Load env vars
dotenv.config({ path: './config/config.env' });
connectDB();
const app = express();
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
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