// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//     },
//     customer: {
//         type: String,
//         required: true,
//     },
//     orderId : {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     productImage : {
//         type: String,
//         required: true,
//     },
//     productId : {
//         type: mongoose.Schema.ObjectId,
//         ref: "Products",
//     },
//     productTitle : {
//         type: String,
//         required: true,
//     },
//     paymentId : {
//         type: String,
//         required: true,
//     },
//     paymentMode: {
//         type: String,
//         enum: ["COD", "Online"],
//         default: "COD",
//     },
//     paymentStatus: {
//         type: String,
//         enum: ["Pending", "Success", "Failed"],
//         default: "Pending",
//     },
//     delivery_address: {
//         type: mongoose.Schema.ObjectId,
//         ref: "Address",
//     },
//     totalAmt : {
//         type: Number,
//         default: 0,
//     },
//     status: {
//         type: String,
//         enum: ["Ordered", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"],
//         default: "Ordered",
//     },
// }, {
//     timestamps: true,
// })

// const orderModel = mongoose.model("Order", orderSchema);

// export default orderModel;


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    customer: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
    productTitle: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Ordered", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Ordered",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;


