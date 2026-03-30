const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ensure Database is connected before handling requests in serverless functions
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Failed to connect to DB in middleware");
        return res.status(500).json({ message: "Database connection error" });
    }
});

app.use("/api/contact", require("./routes/contactRoutes"));

app.get("/", (req, res) => {
    res.send("Naganadham Backend is running");
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;