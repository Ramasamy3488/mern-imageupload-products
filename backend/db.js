const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {  
    await mongoose.connect("mongodb://127.0.0.1:27017/uploadtutorial");
    console.log("Connected to MongoDB Successfully!!");
  } catch (e) {
    console.log("MongoDB Connection Failed:", e.message);
  }
};

module.exports = { connectToMongoDB };
