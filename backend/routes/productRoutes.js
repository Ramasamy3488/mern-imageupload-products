const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// POST: Create product with image
router.post("/", productController.uploadImage, productController.createProduct);

// GET: List all products
router.get("/", productController.getProducts);

// GET: Single product by ID
router.get("/:id", productController.getProductById);

// GET: Update product by ID
router.put("/:id", productController.uploadImage, productController.updateProduct);

// DELETE: Delete product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
