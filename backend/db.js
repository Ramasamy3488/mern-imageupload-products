const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = async () => {
  try {  
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Successfully!!");
  } catch (e) {
    console.log("MongoDB Connection Failed:", e.message);
  }
};

module.exports = { connectToMongoDB };
