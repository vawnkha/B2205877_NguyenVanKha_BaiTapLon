const express = require("express");
const cors = require("cors");
const readerRoute = require("./app/routes/reader.route");
const employeeRoute = require("./app/routes/employee.route");
const publisherRoute = require("./app/routes/publisher.route");
const bookRoute = require("./app/routes/book.route");
const borrowBooksRoute = require("./app/routes/borrow_books.route");
const login = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/doc-gia", readerRoute);
app.use("/api/nhan-vien", employeeRoute);
app.use("/api/nha-xuat-ban", publisherRoute);
app.use("/api/sach", bookRoute);
app.use("/api/muon-sach", borrowBooksRoute);
app.use("/api/login", login);

app.get("/", (req, res) => {
  res.json({ message: "welcome to library application." });
});

app.use((req, res, next) => {
  next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
