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
    origin: "", // frontend origin
    credentials: true, 
  })
);
app.use(express.json());

app.use("/api/user/link", linkRoutes);
app.use("/api/user", userRoutes); 

const PORT = process.env.PORT || 5000;
// ---------------DEPLOYMENT----------------
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "../frontend/dist"))); 
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../frontend", "dist", "index.html")); 
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
// ---------------DEPLOYMENT----------------

const server = app.listen(
  PORT,
  console.log(`Server started on PORT : ${PORT}`)
);
