import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        trim: true,
        required: [true, 'coupon code required'],
        unique: true
    },
    discount: {
        type: Number,
        min: 0,
        required: [true, 'coupon discount required'],

    },
    expires: {
        type: String,
        required: [true, 'coupon date required'],
    }
}, { timestamps: true })


export const couponModel = mongoose.model("Coupon", couponSchema)