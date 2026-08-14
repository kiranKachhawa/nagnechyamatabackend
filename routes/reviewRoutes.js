const express = require("express");
const router = express.Router();
const { createReview, getApprovedReviews, approveReview, rejectReview } = require("../controllers/reviewController");

router.route("/")
    .get(getApprovedReviews)
    .post(createReview);

router.put("/:id/approve", approveReview);
router.put("/:id/reject", rejectReview);

module.exports = router;
