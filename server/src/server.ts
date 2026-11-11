import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import mongoose from 'mongoose';
import { initFirebase } from './config/firebase';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB if URI is provided
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || 'cloudvault'
      });
      console.log('✅ MongoDB connected successfully');
    } else {
      console.warn('⚠️ MONGODB_URI not found. Starting in Dev Mode without DB.');
    }

    // Initialize Firebase Admin
    initFirebase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
