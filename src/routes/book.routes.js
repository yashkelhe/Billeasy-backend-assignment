const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  createBook,
  getAllBooks,
  getBookById,
} = require("../controllers/book.controller");

router.post("/books", authenticate, createBook);
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);

module.exports = router;
