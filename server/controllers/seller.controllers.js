import SellerPriceModel from "../models/sellerPrice.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// add product price
export const addProductPrice = async (req, res) => {
  try {
    const { encryptedUserId, product_id, base_price, profit_price, final_price } = req.body;

    if (!encryptedUserId) {
      return res.status(401).json({ message: "User is not logged in!" });
    }

    // Decrypt userId
    let userId;
    try {
      const decoded = jwt.verify(encryptedUserId, process.env.JSON_WEB_TOKEN_SECRET_KEY);
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ message: "Invalid User ID" });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product already exists in SellerPriceModel
    const existingProduct = await SellerPriceModel.findOne({ seller_id: userId, product_id });

    if (existingProduct) {
      // Update existing record
      existingProduct.base_price = base_price;
      existingProduct.profit_price = profit_price;
      existingProduct.final_price = final_price;
      await existingProduct.save();
      return res.status(200).json({ message: "Product price updated successfully" });
    } else {
      // Create new entry
      const productPrice = new SellerPriceModel({
        seller_id: userId,
        product_id,
        base_price,
        profit_price,
        final_price,
      });
      await productPrice.save();
      return res.status(201).json({ message: "Product price added successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get product price
export const getProductPrice = async (req, res) => {
  try {
    const { encryptedUserId, product_id } = req.query;

    if (!encryptedUserId) {
        return res.status(401).json({ message: "User is not logged in!" });
    }

    // Decrypt userId
    let userId;
    try {
        const decoded = jwt.verify(encryptedUserId, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        userId = decoded.id;
    } catch (error) {
        return res.status(403).json({ message: "Invalid User ID" });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const productPrice = await SellerPriceModel.findOne({ seller_id: userId, product_id });
    if (!productPrice) {
      return res.status(404).json({ message: "Product price not found" });
    }
    res.status(200).json({ message: "Product price found", data: productPrice, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// store share code
export const storeShareCode = async (req, res) => {
  try {
    const { encryptedUserId, product_id, share_code } = req.body;

    if (!encryptedUserId) {
      return res.status(401).json({ message: "User is not logged in!" });
    }

    // Decrypt userId
    let userId;
    try {
      const decoded = jwt.verify(encryptedUserId, process.env.JSON_WEB_TOKEN_SECRET_KEY);
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ message: "Invalid User ID" });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product already exists in SellerPriceModel
    const existingProduct = await SellerPriceModel.findOne({ seller_id: userId, product_id });

    if (existingProduct) {
      // Update share_code for existing product
      existingProduct.shareLink = share_code;
      await existingProduct.save();
      return res.status(200).json({ message: "Share link updated successfully", success: true });
    } else {
      // Create new entry with share_code
      const productPrice = new SellerPriceModel({
        seller_id: userId,
        product_id,
        shareLink: share_code,
      });
      await productPrice.save();
      return res.status(201).json({ message: "Share link added successfully", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get buyer product
export const getBuyerProduct = async (req, res) => {
  try {
    const { share_code } = req.params;

    if (!share_code) {
      return res.status(400).json({ message: "Share code is required" });
    }

    // Find price details based on share code
    const productPrice = await SellerPriceModel.findOne({ shareLink: share_code });

    if (!productPrice) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    // Fetch product details from products collection using product_id
    const productDetails = await ProductModel.findOne({ _id: productPrice.product_id });

    if (!productDetails) {
      return res.status(404).json({ message: "Product details not found", success: false });
    }

    // Encrypt seller_id (token)
    const encryptedToken = jwt.sign({ id: productPrice.seller_id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    // Combine product details and pricing
    const productData = {
      product_id: productPrice.product_id,
      token: encryptedToken,
      title: productDetails.name,
      description: productDetails.description,
      images: productDetails.images, // Assuming images is an array
      base_price: productPrice.base_price,
      profit_price: productPrice.profit_price,
      final_price: productPrice.final_price,
      points: productDetails.points,
    };

    res.status(200).json({ message: "Product found", data: productData, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get seller products
export const getSellerProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Fetch all products for the given seller
    const sellerProducts = await SellerPriceModel.find({ seller_id: id });

    if (!sellerProducts || sellerProducts.length === 0) {
      return res.status(404).json({ message: "No products found for this seller", success: false });
    }

    // Fetch product details for each product_id
    const updatedProducts = await Promise.all(
      sellerProducts.map(async (product) => {
        const productDetails = await ProductModel.findById(product.product_id, "name Code").lean();

        return {
          ProductName: productDetails?.name || "Unknown",
          ProductCode: productDetails?.Code || "N/A",
          base_price: product.base_price,
          profit_price: product.profit_price,
          final_price: product.final_price,
          shareLink: product.shareLink,
          updatedData: product.updatedAt,
        };
      })
    );

    res.status(200).json({ message: "Products found", data: updatedProducts, success: true });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};


