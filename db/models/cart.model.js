import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
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
        totalPrice: Number,
        discount: Number,
        totalPriceAfterDiscount: Number
    },
    { timestamps: true }
)

cartSchema.pre(/^find/, function () {
    this.populate("user", "name")
})


export const cartModel = mongoose.model('Cart', cartSchema)



