import { orderModel } from "../../../db/models/order.model.js";
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js";
import { productModel } from '../../../db/models/product.model.js'
import { AppError } from "../../utils/services/AppError.js"
import { cartModel } from "../../../db/models/cart.model.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51O6fuIEcxhgvajHwbW9OzIkNDFw5cGWja9r8JfqPeYBwjvxYKBsDSk2jg7lmn9hEndJefgiMRkkgXP0a6Axz40aV00WXiGXDzw');

const createCashOrder = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findById(req.params.id)

    let totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice

    let order = new orderModel({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress
    })

    if (order) {
        let options = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }))
        await productModel.bulkWrite(options)
        await order.save()
    } else {
        return next(new AppError("order is not created", 409))
    }
    await cartModel.findByIdAndDelete(req.params.id)
    res.json({ message: 'Done', order })
})

const getOrder = catchAsyncError(async (req, res, next) => {
    let order = await orderModel.findOne({ user: req.user._id }).populate('cartItems.product')
    res.json({ message: "Done", order })
})

const getAllOrders = catchAsyncError(async (req, res, next) => {
    let order = await orderModel.find({ user: req.user._id })
    res.json({ message: "Done", order })
});

const onlinePayment = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findById(req.params.id)
    let totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice

    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp",
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name
                    },
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: "https://route-comm.netlify.app/#/",
        cancel_url: "https://route-comm.netlify.app/#/cart",
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress
    });


    res.json({ message: "Done", session })
})
// const removeProductFromOrder = catchAsyncError(async (req, res, next) => {


// })

// const updateOrder = catchAsyncError(async (req, res, next) => {

// })

export {
    createCashOrder,
    getOrder, getAllOrders,
    // ,removeProductFromOrder, updateOrder
    onlinePayment
}