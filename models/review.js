const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        city: {
            type: String,
            trim: true,
            default: ""
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"]
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Review", reviewSchema);
