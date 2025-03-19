import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    address_line : {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    state: {
        type: String,
        default: "",
    },
    country: {
        type: String,
    },
    pincode: {
        type: String,
    },
    mobile: {
        type: Number,
        default: null
    },
    userId : {
        type: mongoose.Schema.ObjectId,
        default : ""
    }
}, {
    timestamps: true,
})

const AddressModel = mongoose.model("Address", addressSchema);
export default AddressModel;

