const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const reviewRoutes = require("./routes/review.routes");
const searchRoutes = require("./routes/search.routes");

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", reviewRoutes);
app.use("/api/search", searchRoutes); // 👈 search route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
