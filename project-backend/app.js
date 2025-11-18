const express = require("express");
const cors = require("cors");
const readerRoute = require("./app/routes/reader.route");
const employeeRoute = require("./app/routes/employee.route");

const login = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/doc-gia", readerRoute);
app.use("/api/nhan-vien", employeeRoute);

app.use("/api/login", login);

app.get("/", (req, res) => {
    res.json({ message: "welcome to library application."});
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