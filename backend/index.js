const express = require("express");
const cors = require("cors");
const path = require('path')
const productRoutes = require("./routes/productRoutes");

const conn = require('./db');

conn.connectToMongoDB();

const app = express();

app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static("uploads")); // serve images

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use("/products", productRoutes);

app.listen(8000, () => console.log("Server running on 8000"));
