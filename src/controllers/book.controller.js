const prisma = require("../../prisma/client");

// POST /books – Add a new book (Authenticated)
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;

    const book = await prisma.book.create({
      data: { title, author, genre },
    });

    res.status(201).json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create book", error: err.message });
  }
};

// GET /books – Get all books with pagination + filters
exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const skip = (page - 1) * limit;

    const filters = {};
    if (author) filters.author = { contains: author, mode: "insensitive" };
    if (genre) filters.genre = { contains: genre, mode: "insensitive" };

    const books = await prisma.book.findMany({
      where: filters,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    res.json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: err.message });
  }
};

// GET /books/:id – Get book details by ID with average rating & reviews
exports.getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        reviews: {
          skip: Number(skip),
          take: Number(limit),
          orderBy: { createdAt: "desc" },
          include: { user: { select: { fullName: true } } },
        },
      },
    });

    if (!book) return res.status(404).json({ message: "Book not found" });

    const avgRating = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
    });

    res.json({
      ...book,
      averageRating: avgRating._avg.rating ?? 0,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch book details", error: err.message });
  }
};
