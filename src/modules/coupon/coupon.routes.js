import express from "express"
import * as couponcontroller from "./coupon.controller.js"
import { protectRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();


couponRouter.route("/")
    .get(couponcontroller.getAllCoupons)
    .post(protectRoutes, couponcontroller.createCoupon);

couponRouter.route("/:id")
    .get(protectRoutes, couponcontroller.getCouponById)
    .put(protectRoutes, couponcontroller.updateCoupon)
    .delete(couponcontroller.deleteCoupon);


export default couponRouter;