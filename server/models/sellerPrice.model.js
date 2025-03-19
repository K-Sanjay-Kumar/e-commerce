import mongoose from "mongoose";

const sellerPriceSchema = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References the User collection
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // References the Product collection
            required: true,
        },
        base_price: {
            type: Number,
            required: true,
        },
        profit_price: {
            type: Number,
            required: true,
        },
        final_price: {
            type: Number,
            required: true,
        },
        shareLink: {
            type: String,
            required: false,
            default: "",
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const SellerPriceModel = mongoose.model("SellerPrice", sellerPriceSchema);
export default SellerPriceModel;
