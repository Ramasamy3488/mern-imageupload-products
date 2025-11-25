const Product = require("../models/product");
const multer = require("multer");
const fs = require('fs');
const path = require("path");


/////////////////////////////////////

// multer uploads in project folder

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"),
//   filename: (req, file, cb) =>
//     cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
// });

// const maxSize = 2 * 1024 * 1024; // 2MB

// const upload = multer({ storage, limits: { fileSize: maxSize } });


/////////////////////////////////////////


const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "books",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage});



// Middleware for single file upload
const uploadImage = upload.single("image");

// // Create a product
// const createProduct = async (req, res) => {
//   try {
//     const { title, author, price } = req.body;

//     if (!title) return res.status(400).json({ message: "Title is required" });

//     // const image = req.file ? req.file.filename : null;

//        // Generate full URL for the uploaded image
//     const image = req.file
//       ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
//       : null;

//     const product = new Product({ title, author, price, image });
//     await product.save();

//     res.status(201).json({ message: "Product created successfully", product });

    
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


////////////////////////////////////////////////////////////


const createProduct = async (req, res) => {
  try {
    const { title, author, price } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const image = req.file ? req.file.path : null; // Cloudinary returns URL here

    const product = new Product({ title, author, price, image });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


///////////////////////////////////////////////////



// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


////////////////////////////////////////////////////////


// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product by ID

// const updateProduct = async (req, res) => {
//   try {
//     const { title, author, price } = req.body; // Multer parses these
//     const productId = req.params.id;

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     if (title) product.title = title;
//     if (author) product.author = author;
//     if (price) product.price = Number(price);

//     if (req.file) {
//       if (product.image) {
//         const oldImagePath = path.join(__dirname, "../uploads", path.basename(product.image));
//         if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
//       }
//       product.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }

//     await product.save();
//     res.status(200).json({ message: "Product updated successfully", product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// };


///////////////////////////////////////


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price } = req.body;

    // Find product by ID.

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let newImageUrl = product.image; // default = old image

    // If new image uploaded → delete old image & replace with new one

    if (req.file) {

      // ----Delete old Cloudinary image----
      if (product.image) {
        const oldUrl = product.image;
        const publicId = oldUrl.split("/").pop().split(".")[0]; // extract name

        // If your Cloudinary upload folder is `books`, include it:
        await cloudinary.uploader.destroy(`books/${publicId}`);
      }
      
      // ---- Store new image----
      newImageUrl = req.file.path; // multer-storage-cloudinary returns URL
    }

    //  Update product fields

    product.title = title ?? product.title;
    product.author = author ?? product.author;
    product.price = price ?? product.price;
    product.image = newImageUrl;

    await product.save();

    res.json({ 
      message: "Product updated successfully", 
      product 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// // Delete product by ID
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // If image exists -> remove the uploaded file
//     if (product.image) {
//       const imageName = path.basename(product.image); // Extract filename from URL
//       const imagePath = path.join(__dirname, "../uploads", imageName);

//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     // Delete product from DB
//     await Product.findByIdAndDelete(req.params.id);

//     res.json({ message: "Product deleted successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };



const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image from Cloudinary if exists

    if (product.image) {
      // Extract public_id from URL: "https://res.cloudinary.com/.../books/abcxyz.jpg"
      const imageUrl = product.image;
      const publicId = imageUrl.split("/").pop().split(".")[0]; // get abcxyz from URL

      await cloudinary.uploader.destroy(`books/${publicId}`); 
    }

    // Delete product from DB
    
    await Product.findByIdAndDelete(id);

    res.json({ message: "Product and Cloudinary image deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  uploadImage,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct



}



/* 

const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      image: req.file.filename
    });

    res.json({ message: "Product created successfully!", product: newProduct });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // if new file uploaded -> remove old file
    if (req.file) {
      const oldImagePath = path.join("uploads", product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = req.file.filename;
    }

    product.title = title;
    product.description = description;
    product.price = price;

    await product.save();

    res.json({ message: "Product updated!", product });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // delete image file
    const imagePath = path.join("uploads", product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



*/