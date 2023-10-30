import express from 'express'
import * as orderController from './order.controller.js'
import { allowedTo, protectRoutes } from '../auth/auth.controller.js'


const orderRouter = express.Router()

orderRouter.post("/:id", protectRoutes, orderController.createCashOrder)

orderRouter.route('/')
    .get(protectRoutes, orderController.getOrder)
    .get(allowedTo('admin'), orderController.getAllOrders)

orderRouter.post('/checkout/:id', protectRoutes, orderController.onlinePayment)
export default orderRouter