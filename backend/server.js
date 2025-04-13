const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const cors = require('cors');

const app = express();

dotenv.config();
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // if you're using cookies or Authorization headers
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/user/link", linkRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server started on PORT : ${PORT}`)
);
