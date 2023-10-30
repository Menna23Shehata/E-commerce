import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                price: Number
            },
        ],
        totalOrderPrice: Number,
        discount: Number,
        totalOrderPriceAfterDiscount: Number,
        paymentMethod: {
            type: String,
            enums: ["cash", "credit"],
            default: "cash",
        },
        shippingAddress: {
            city: String,
            street: String
        },
        isPaid: { // for online payment
            type: Boolean,
            default: false
        },
        paidAt: Date,
        isDelivered: { // for cash on delivery payment
            type: Boolean,
            default: false
        },
        notes: String
    },
    { timestamps: true }
)

export const orderModel = mongoose.model('Order', orderSchema)