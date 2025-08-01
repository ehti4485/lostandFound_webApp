import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

// WHAT-IT-DOES: Connects to MongoDB database and starts the Express server
async function startServer() {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

