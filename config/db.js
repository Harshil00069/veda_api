import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
// Move the variable INSIDE the function so it reads process.env when connectDB() is called
  const dbURI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!dbURI) {
    console.error('❌ MONGO_URI is missing from process.env');
    return;
  }

  try {
    const conn = await mongoose.connect(dbURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
  }
};

export default connectDB;