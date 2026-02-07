import mongoose from 'mongoose';

export const connectDB = async (mongoUri) => {
  try {
    console.log('Connecting to Mongo URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected to DB:', mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

