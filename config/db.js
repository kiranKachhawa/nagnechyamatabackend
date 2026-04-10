const mongoose = require("mongoose");

const connectDB = async () => {
  // Check if we already have a connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error; // Throw error to be caught by the middleware
  }
};

module.exports = connectDB;