const prisma = require("../prisma/client");

// POST /books/:id/reviews – Add a review (only one per user per book)
exports.createReview = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    // Check for existing review
    const existingReview = await prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId,
        bookId,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create review", error: err.message });
  }
};

// PUT /reviews/:id – Update own review
exports.updateReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this review" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating: parseInt(rating), comment },
    });

    res.json(updatedReview);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update review", error: err.message });
  }
};

// DELETE /reviews/:id – Delete own review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const userId = req.user.id;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this review" });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: err.message });
  }
};
