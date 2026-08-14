const express = require("express");
const router = express.Router();
const { createReview, getApprovedReviews } = require("../controllers/reviewController");

router.route("/")
    .get(getApprovedReviews)
    .post(createReview);
 
module.exports = router;
