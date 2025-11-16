const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchain-certificates';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  srn: { type: String, required: true },
  studentName: String,
  eventName: { type: String, required: true },
  certificateUrl: { type: String, required: true },
  issueDate: Date,
  description: String,
  badgeType: String,
  transactionHash: String,
  verified: Boolean,
  ipfsHash: String,
  tokenId: String,
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema, 'certificates');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'CIESpark Backend API is running!' });
});

// Get all certificates
app.get('/api/certificates', async (req, res) => {
  try {
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
    const { srn, eventName } = req.params;
    const certificate = await Certificate.findOne({ 
      srn, 
      eventName: new RegExp(eventName.replace(/\s+/g, '\\s*'), 'i')
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
    const totalCertificates = await Certificate.countDocuments();
    const uniqueStudents = await Certificate.distinct('srn');
    const uniqueEvents = await Certificate.distinct('eventName');
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
