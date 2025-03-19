import orderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken"; // Use jsonwebtoken for decryption
import dotenv from "dotenv";

dotenv.config();

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json({ orders });

    } catch (error) {
        console.error("Error in getAllOrders:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const { encryptedUserId } = req.params;

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

        // Get orders for the user
        const orders = await orderModel.find({ userId });
        res.status(200).json({ orders });

    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// get order count of a user
export const getOrdersCountByUserId = async (req, res) => {
    try {
        const { encryptedUserId } = req.params;

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

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ordersCount = user.orders.length; // Get cart array length
        console.log("ordersCount", ordersCount);
        res.status(200).json({ count: ordersCount });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
    console.log("orderID", req.params);
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order status
        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully" });

    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Buyer Place order
export const placeOrder = async (req, res) => {
    try {
      const {
        encryptedUserId,
        customer,
        productId,
        productImage,
        productTitle,
        paymentId,
        paymentMode,
        paymentStatus,
        address,
        city,
        state,
        pincode,
        totalAmt,
        status,
      } = req.body;

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
  
      if (!customer || !productId || !productImage || !productTitle || !address || !city || !state || !pincode) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      const newOrder = new orderModel({
        userId,
        customer,
        orderId: "ORD-" + productTitle.slice(0, 3).toUpperCase() + "-" + Math.floor(100000 + Math.random() * 900000).toString(), // Unique order ID
        productId,
        productImage,
        productTitle,
        paymentId,
        paymentMode,
        paymentStatus,
        address,
        city,
        state,
        pincode,
        totalAmt,
        status,
      });
  
      await newOrder.save();

      // Update user's order list
      await UserModel.updateOne({ _id: userId }, { $push: { orders: newOrder._id } });

      return res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
    } catch (error) {
      console.error("Error placing order:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };


  