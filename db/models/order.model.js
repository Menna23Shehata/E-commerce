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
        isPaid: Boolean, // for online payment
        paidAt: Date,
        isDelivered: Boolean, // for cash on delivery payment
    },
    { timestamps: true }
)

export const orderModel = mongoose.model('Order', orderSchema)