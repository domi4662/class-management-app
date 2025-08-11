const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/class-management';
    console.log('Attempting to connect to MongoDB...');
    console.log('URI (with password hidden):', uri.replace(/:([^@]+)@/, ':****@'));
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Connection ready state: ${conn.connection.readyState}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:');
    console.error('  Message:', error.message);
    console.error('  Code:', error.code);
    console.error('  Name:', error.name);
    
    if (error.message.includes('bad auth')) {
      console.error('  This is an authentication error. Check:');
      console.error('    - Username and password are correct');
      console.error('    - User exists in MongoDB Atlas');
      console.error('    - User has proper permissions');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('  This is a DNS resolution error. Check:');
      console.error('    - Cluster name is correct');
      console.error('    - Network connectivity');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 