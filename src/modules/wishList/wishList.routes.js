
import express from "express"
import * as wishListController from './wishList.controller.js'
import { protectRoutes } from "../auth/auth.controller.js";

const wishListRouter = express.Router();

wishListRouter.route('/')
    .patch(protectRoutes, wishListController.addToWishList)
    .delete(protectRoutes, wishListController.deleteFromWishList)
    .get(protectRoutes, wishListController.getWishList)

export default wishListRouter;