const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("=> using existing database connection");
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI environment variable is not set.");
        throw new Error("MONGO_URI not set");
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("=> using new database connection");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
};

module.exports = connectDB;