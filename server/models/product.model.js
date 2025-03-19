import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        Code: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        oldPrice: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        stock: {
            type: Number
        },
        sales: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        sizes: { 
            type: [Number], // Array to store quantities for [Small, Medium, Large]
            required: true,
            default: [0, 0, 0] // Default to 0 for all sizes
        },
        images: {
            type: [String],
            required: true
        },
        points: {
            type: [String], // Array of strings to store points about the item
            required: false // Optional field
        }
    }, 
    {
        timestamps: true,
    }
);

const ProductModel = mongoose.model("Products", productSchema);
export default ProductModel;


