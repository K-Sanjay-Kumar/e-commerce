import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
import productRouter from "./routes/product.router.js";
import addressRouter from "./routes/address.router.js";
import orderRouter from "./routes/order.router.js";
import sellerRouter from "./routes/seller.router.js";
dotenv.config();

const app = express();
app.use(cors());
app.options("*", cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true })); // ✅ For form data

// Serve uploaded files statically (optional)
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy: false
}));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ message: "Hello World" + port });
});


app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/address', addressRouter);
app.use('/api/orders', orderRouter);
app.use('/api/seller', sellerRouter);


app.listen(port, () =>{
    connectDB();
    console.log("server started at localhost:5000");
});
