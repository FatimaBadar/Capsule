import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
// import requirementsRouter from './api/requirements.js';
import clothesRouter from './api/clothes.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000

// const corsOptions = {
//     origin: ['http://localhost:5173'], 
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], 
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
// };

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Setup
mongoose.connect(process.env.ATLAS_URL).then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});


// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//API Routes
// app.use('/api/requirements', requirementsRouter);
app.use('/api/clothes', clothesRouter);

// app.use('/api/ui', uiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    statusCode: String(err.status || 500),
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: '404',
    error: 'Route not found'
  });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
export default app;
