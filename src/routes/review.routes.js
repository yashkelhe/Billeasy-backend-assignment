const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

router.post("/books/:id/reviews", authenticate, createReview);
router.put("/reviews/:id", authenticate, updateReview);
router.delete("/reviews/:id", authenticate, deleteReview);

module.exports = router;
