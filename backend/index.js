const express = require("express");
const cors = require("cors");
const path = require('path')
const productRoutes = require("./routes/productRoutes");

const conn = require('./db');

conn.connectToMongoDB();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // if using cookies/token
}));

app.use(express.json());
// app.use("/uploads", express.static("uploads")); // serve images

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/products", productRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
