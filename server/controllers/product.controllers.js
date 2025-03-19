    import ProductModel from "../models/product.model.js";
import crypto from "crypto";
import { cloudinary } from "../config/cloudinary.js";

// ✅ Add Product with Cloudinary Upload
export const addProduct = async (req, res) => {
    try {
        const { name, price, oldPrice, description, sizes, points } = req.body;

        // Convert string numbers to actual numbers
        const parsedPrice = Number(price);
        const parsedOldPrice = Number(oldPrice);

        // Convert sizes from string to array of numbers
        const parsedSizes = sizes ? JSON.parse(sizes).map(Number) : [];

        // Calculate stock dynamically as the sum of all sizes
        const parsedStock = parsedSizes.reduce((total, size) => total + size, 0);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url;
            })
        );

        // Generate unique product code
        const generatedCode = `P-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // Convert points to an array (if sent as a stringified JSON)
        const parsedPoints = points ? JSON.parse(points) : [];

        const product = new ProductModel({
            name,
            Code: generatedCode,
            price: parsedPrice,
            oldPrice: parsedOldPrice,
            description,
            stock: parsedStock, // Updated stock calculation
            sizes: parsedSizes, // Store sizes
            images: uploadedImages,
            points: parsedPoints, // ✅ Store points in the database
        });

        const savedProduct = await product.save();

        return res.status(201).json({ message: "Product added successfully", data: savedProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ✅ Get All Products
export const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({ message: "All products", data: products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//get the product by id
export const getProductsById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        return res.status(200).json({ message: "Product", data: product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//get all total no.of products
export const getProductsCount = async (req, res) => {
    try {
        const total = await ProductModel.countDocuments();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//get all total no.of selling products
export const getTopSellingCount = async (req, res) => {
    try {
        const topSelling = await ProductModel.countDocuments({ sales: { $gt: 500 } });
        res.json({ topSelling });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}   

//get all total no.of low stock products
export const getLowStockCount = async (req, res) => {
    try {
        const lowStock = await ProductModel.countDocuments({ stock: { $lt: 50 } });
        res.json({ lowStock });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//get all total revenue
export const getRevenue = async (req, res) => {
    try {
        const result = await ProductModel.aggregate([
            { $group: { _id: null, revenue: { $sum: { $multiply: ["$price", "$sales"] } } } }
        ]);
        const revenue = result.length > 0 ? result[0].revenue : 0;
        res.json({ revenue });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}



// ✅ Update Product
export const updateProducts = async (req, res) => {
    const { id } = req.params;
    const { name, oldPrice, price, description, images, sizes, points } = req.body;

    try {
        // Convert sizes from string to an array of numbers if provided
        const parsedSizes = Array.isArray(sizes) ? sizes.map(Number) : JSON.parse(sizes);

        // Calculate stock dynamically as the sum of all sizes
        const parsedStock = parsedSizes.reduce((total, size) => total + size, 0);

        // Parse points array if it's a string
        const parsedPoints = Array.isArray(points) ? points : JSON.parse(points);

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            {
                name,
                oldPrice,
                price,
                description,
                stock: parsedStock, // Updated stock calculation
                images,  // Ensure images are updated correctly
                sizes: parsedSizes,
                points: parsedPoints // Include points in the update
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        // Extract public ID from Cloudinary URLs
        await Promise.all(
            product.images.map(async (url) => {
                const publicId = url.split('/').pop().split('.')[0]; // Extract public ID
                await cloudinary.uploader.destroy(publicId);
            })
        );

        // Delete product from database
        await ProductModel.findByIdAndDelete(id);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



