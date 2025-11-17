import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://cie-sparke-website.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in environment variables");
}

// Important: Do NOT reconnect on every serverless call
// So we store the connection in a global variable
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB (Vercel Serverless)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  srn: { type: String, required: true },
  studentName: String,
  event: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: Date,
  achievement: String,
  projectDescription: String,
  transactionHash: String,
  verified: Boolean,
  ipfsHash: String,
  tokenId: String,
}, { timestamps: true });

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model('Certificate', certificateSchema, 'certificates');

// Routes
app.get('/', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ message: 'CIESpark Backend API is running!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Get all certificates
app.get('/api/certificates', async (req, res) => {
  try {
    await connectToDatabase();
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get certificate by SRN and event name
app.get('/api/certificates/:srn/:eventName', async (req, res) => {
  try {
    await connectToDatabase();
    const { srn, eventName } = req.params;
    const certificate = await Certificate.findOne({
      srn,
      event: new RegExp(eventName.replace(/\s+/g, '\\s*'), 'i')
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// Get certificates by SRN
app.get('/api/certificates/student/:srn', async (req, res) => {
  try {
    await connectToDatabase();
    const { srn } = req.params;
    const certificates = await Certificate.find({ srn }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get certificate statistics
app.get('/api/stats', async (req, res) => {
  try {
    await connectToDatabase();
    const totalCertificates = await Certificate.countDocuments();
    const uniqueStudents = await Certificate.distinct('srn');
    const uniqueEvents = await Certificate.distinct('event');
    const recentCertificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalCertificates,
      totalStudents: uniqueStudents.length,
      totalEvents: uniqueEvents.length,
      recentCertificates
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.status(200).end();
});

// Catch-all handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    message: 'CIESpark Backend API is running, but this route does not exist.',
    availableRoutes: ['/api/stats', '/api/certificates', '/api/certificates/:srn/:eventName', '/api/certificates/student/:srn']
  });
});

// ❗ NO app.listen() — Vercel handles the server

export default app;
