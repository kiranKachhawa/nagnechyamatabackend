const Review = require("../models/review");

// Helper to escape HTML to prevent XSS
const sanitizeString = (str) => {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
};

// Map to track IP submission timestamps for basic rate limiting
const ipCache = new Map();
const RATE_LIMIT_MS = 60000; // 1 minute window

// Submit a new review (pending by default)
exports.createReview = async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const now = Date.now();
        if (ipCache.has(ip)) {
            const lastSubmission = ipCache.get(ip);
            if (now - lastSubmission < RATE_LIMIT_MS) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please wait a minute before submitting another review."
                });
            }
        }

        const { name, rating, message, city } = req.body;
        
        if (!name || !rating || !message) {
            return res.status(400).json({
                success: false,
                message: "All required fields (Name, Rating, Message) must be filled"
            });
        }

        const parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Sanitize strings
        const cleanName = sanitizeString(name.trim()).slice(0, 100);
        const cleanCity = city ? sanitizeString(city.trim()).slice(0, 100) : "";
        const cleanMessage = sanitizeString(message.trim()).slice(0, 1000);

        const review = await Review.create({
            name: cleanName,
            city: cleanCity,
            rating: parsedRating,
            message: cleanMessage, 
        });

        // Set rate limit timestamp
        ipCache.set(ip, now);

        res.status(201).json({
            success: true,
            message: "Review submitted successfully!",
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all approved reviews
exports.getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin approve review
exports.approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(id, { status: "approved" }, { new: true });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Review approved successfully",
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin reject review
exports.rejectReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Review rejected successfully",
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
