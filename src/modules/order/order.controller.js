import { orderModel } from "../../../db/models/order.model.js";
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js";
import { productModel } from '../../../db/models/product.model.js'
import { AppError } from "../../utils/services/AppError.js"
import { cartModel } from "../../../db/models/cart.model.js";
import Stripe from 'stripe';
import { userModel } from "../../../db/models/user.model.js";
const stripe = new Stripe('sk_test_51O6fuIEcxhgvajHwbW9OzIkNDFw5cGWja9r8JfqPeYBwjvxYKBsDSk2jg7lmn9hEndJefgiMRkkgXP0a6Axz40aV00WXiGXDzw');

const createCashOrder = catchAsyncError(async (req, res, next) => {
    // 1- get cart usin cart id
    let cart = await cartModel.findById(req.params.id)

    // 2- get total price or get total price after discount if there's a discount 
    let totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice

    // 3- place order 
    let order = new orderModel({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress
    })

    // 4- decrement in quantity & incremet in sold
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

    // 5- clear user's cart
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

const createOnlineOrder = catchAsyncError((request, response) => {
    const sig = request.headers['stripe-signature'].toString()

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, "whsec_5ZbAgKtGrbCZvmaz2zjyD4fcINO19Wkd");
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type == "checkout.session.completed") {
        card(event.data.object)
        console.log("create order here .....");
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }
})


export {
    createCashOrder,
    getOrder, getAllOrders,
    onlinePayment, createOnlineOrder
}

async function card(e) {
    let cart = await cartModel.findById(e.client_reference_id)
    if (!cart) return next(new AppError('cart not found', 404))

    let user = await userModel.findOne({ email: e.customer_email })

    let order = new orderModel({
        user: user._id,
        cartItems: cart.cartItems,
        totalOrderPrice: e.amount_total / 100,
        shippingAddress: e.metadata.shippingAddress,
        paymentMethod: "credit",
        isPaid: true,
        paidAt: Date.now()
    })

    if (order) {
        let options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }))
        await productModel.bulkWrite(options)
        await order.save()
        
        await cartModel.findOneAndDelete({ user: user._id })
        res.status(200).json({ message: 'Done', order })
    } else {
        return next(new AppError("order is not created", 409))
    }
}