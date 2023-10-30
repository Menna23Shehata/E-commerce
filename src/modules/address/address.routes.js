import express from "express"
import * as addressController from './address.controller.js'
import { allowedTo, protectRoutes } from "../auth/auth.controller.js";

const addressRouter = express.Router();

addressRouter.route('/')
    .patch(protectRoutes, addressController.addAddress) //allowedTo('user'),
    .delete(protectRoutes, allowedTo('user'), addressController.deleteAddress)
    .get(protectRoutes, allowedTo('user'), addressController.getAllAddresses)

export default addressRouter;