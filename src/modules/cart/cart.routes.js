import express from 'express'
import * as cartController from './cart.controller.js'
import { allowedTo, protectRoutes } from '../auth/auth.controller.js'

const cartRouter = express.Router()

cartRouter.route('/')
    .post(protectRoutes, allowedTo('user'), cartController.createCart)
    .get(protectRoutes, allowedTo('user'), cartController.getCart)

cartRouter.route("/:id")
    .delete(protectRoutes, allowedTo('user'), cartController.removeProductFromCart)
    .patch(protectRoutes, allowedTo('user'), cartController.updateCart)

cartRouter.put("/:code", protectRoutes, allowedTo('user'), cartController.applyCoupon)


export default cartRouter