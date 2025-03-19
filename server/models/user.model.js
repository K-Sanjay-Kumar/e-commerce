import mongoose, { mongo } from "mongoose";

const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        refresh_token: {
            type: Number,
            default: "",
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Suspended"],
            default: "Active",
        },
        last_login_date : {
            type: Date,
            default: Date.now,
        },
        otp: {
            type: String,
            default: "",
        },
        otp_expiry: {
            type: Date,
            default: Date.now,
        },
        address: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Address",
            }
        ],
        orders: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Orders",
            }
        ],
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", usersSchema);
export default UserModel;   