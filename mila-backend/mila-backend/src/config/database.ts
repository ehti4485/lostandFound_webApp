import mongoose from 'mongoose';

// WHAT-IT-DOES: Establishes connection to MongoDB database
// HOW-TO-USE: Set MONGODB_URI environment variable with your MongoDB connection string
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/echofind';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing without database for demo purposes...');
    // Don't throw error to allow server to start without MongoDB
  }
};

// WHAT-IT-DOES: Gracefully closes database connection
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

