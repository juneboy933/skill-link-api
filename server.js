import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';

import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import skillRoute from './routes/skill.js';
import reviewRoute from "./routes/review.js";
import mentorshipRoute from "./routes/mentorship.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Connect DB
connectDB();

// Main Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/skills', skillRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/mentorships', mentorshipRoute);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to Skill-Link API 🚀');
});

// Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// General Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});