// Basic Lib Imports
const express = require('express');
const bodyParser = require('body-parser');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
// Database connection with mongoose
const connectDB = require('./config/db');

connectDB();

const quizRouters = require('./routes/quizRouters');
const userRouters = require('./routes/userRouters');
const categoryRouters = require('./routes/categoryRouters');
const leaderboardRouters = require('./routes/leaderboardRouters');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
// This is CORS-enabled for all origins!
app.use(
  cors({
    // TODO: Change this based on frontend configuration
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 3600,
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

// Routing Implement
app.use('/api/v1/quizzes', quizRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/category', categoryRouters);
app.use('/api/v1/leaderboard', leaderboardRouters);

// Undefined Route Implement
app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', data: 'Not Found' });
});

// Custome error handler
app.use(errorHandler);

module.exports = app;
