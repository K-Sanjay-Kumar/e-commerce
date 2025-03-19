import UserModel from "../models/user.model.js";
import sendEmail from "../config/sendEmail.js";
import jwt from 'jsonwebtoken'

// Google login
export const DirectLogin = async (req, res) => {
    const {name, mobile, email, picture} = req.body;
    try{
        let user = await UserModel.findOne({ email: email });
        if(user){
            const token = jwt.sign(
                {email: user.email, id: user._id},
                process.env.JSON_WEB_TOKEN_SECRET_KEY
            )

            const encryptedId = jwt.sign(
                { id: user._id },
                process.env.JSON_WEB_TOKEN_SECRET_KEY,
                { algorithm: "HS256" }
            );

            // return res.status(200).json({ success: true, message: "User loged in succesfully!", token: token })
            return res.status(200).json({
                success: true,
                message: "User logged in successfully!",
                token: encryptedId,
                user: {
                    name: user.name,
                    email: user.email,
                    picture: user.avatar
                }
            });
        }
        user = new UserModel({
            name: name,
            email: email,
            mobile: mobile,
            avatar: picture
        })

        await user.save();
        user = UserModel.findOne({ email: email });

        const encryptedId = jwt.sign(
            { id: user._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        // return res.status(200).json({ success: true, message: "User loged in succesfully!"})
        return res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            token: encryptedId,
            user: {
                name: user.name,
                email: user.email,
                picture: user.avatar
            }
        });
        
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// OTP login
export const OTPLogin = async (req, res) => {
    try{
        let user;
        const { email} = req.body;

        if(!email){
            return res.status(400).json({ message: "Please provide email" });
        }

        user = await UserModel.findOne({ email: email });
        if(!user){
            return res.status(400).json({ message: "Invalid User! Please login through Google" });
        }

        const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();

        const expiryTime = Date.now() + 600000; // OTP expiry set to 10 minutes

        // Update user's OTP and expiry in the database
        user.otp = verifyCode;
        user.otp_expiry = expiryTime;
        await user.save();

        //Send OTP to email
        await sendEmail({
            to : email,
            subject : "OTP Verification",
            text : `Your OTP is ${verifyCode}`
        })

        return res.status(200).json({ success: true, message: "OTP Sent succesfully!" })
        
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Verify OTP
export const VerifyOTP = async (req, res) => {
    try{
        let user;
        const { email, otp} = req.body;

        if(!otp){
            return res.status(400).json({ message: "Please provide OTP" });
        }

        user = await UserModel.findOne({ email: email });
        if(!user){
            return res.status(400).json({ message: "Invalid User! Please login through Google" });
        }

        if(user.otp !== otp){
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if(user.otp_expiry < Date.now()){
            return res.status(400).json({ message: "OTP expired" });
        }

        const encryptedId = jwt.sign(
            { id: user._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY,
            { algorithm: "HS256" }
        );

        // return res.status(200).json({ success: true, message: "User loged in succesfully!"})
        return res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            token: encryptedId,
            user: {
                name: user.name,
                email: user.email,
                picture: user.avatar
            }
        });
        
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Get all users
export const getUsers = async (req, res) => {
    try{
        const users = await UserModel.find().populate("address", "address_line city state country pincode");
        res.status(200).json(users);
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
}


