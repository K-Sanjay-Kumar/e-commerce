import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken"; // Use jsonwebtoken for decryption
import dotenv from "dotenv";

dotenv.config();

// add address to user
export const addAddress = async (req, res) => {
    try {

        const { encryptedUserId, address_line, city, state, country, pincode, mobile, name } = req.body;

        if (!encryptedUserId) {
            return res.status(401).json({ message: "User is not Logged in!" });
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
        if(!userId || !user){
            return res.status(401).json({ message: "Invalid User" });
        }

        if(!address_line || !city || !state || !country || !pincode || !mobile){
            return res.status(402).json({ message: "All fields are required" });
        }

        const address = new AddressModel({
            userId: userId,
            name: name,
            address_line: address_line,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            mobile: mobile
        });

        const save = await address.save();

        const updateAddress = await UserModel.updateOne({_id : userId}, {
            $push: { address: save._id}
        })

        return res.status(200).json({ message: "Address added successfully", data: save });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get address by user id
export const getAddressByUserId = async (req, res) => {
    try {
        const { encryptedUserId } = req.params;

        if (!encryptedUserId) {
            return res.status(401).json({ message: "User is not Logged in!" });
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
        if(!userId || !user){
            return res.status(401).json({ message: "Invalid User" });
        }

        const address = await AddressModel.find({ userId: userId });

        return res.status(200).json({ message: "Address fetched successfully", data: address });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// delete address by address id
export const deleteAddress = async (req, res) => {
    try {
        const { encryptedUserId, addressId } = req.body;

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

        if (!userId || !addressId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        const result = await AddressModel.findOneAndDelete({ userId, _id: addressId });

        if (!result) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Remove productId from the user's cart array in UserModel
        await UserModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { address: addressId } },
            { new: true }
        );

        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}



export const updateAddress = async (req, res) => {
    try {
        const { addressId, address_line, city, state, country, pincode, mobile } = req.body;
        const address = await AddressModel.findById(addressId);
        if(!address){
            return res.status(401).json({ message: "Invalid Address" });
        }
        address.address_line = address_line;
        address.city = city;
        address.state = state;
        address.country = country;
        address.pincode = pincode;
        address.mobile = mobile;

        const save = await address.save();

        return res.status(200).json({ message: "Address updated successfully", data: save });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

