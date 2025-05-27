const express = require("express");
const router = express.Router();
const { searchBooks } = require("../controllers/search.controller");

router.get("/", searchBooks);

module.exports = router;
