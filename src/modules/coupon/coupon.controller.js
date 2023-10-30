import { couponModel } from "../../../db/models/coupon.model.js"
import { AppError } from "../../utils/services/AppError.js"
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../utils/handlers/refactor.handler.js"
import ApiFeature from "../../utils/APIFeatures.js"
import QRCode from 'qrcode'

const createCoupon = catchAsyncError(async (req, res, next) => {

    let results = new couponModel(req.body)
    await results.save()

    res.status(201).json({ message: "Done", results })
})


const getAllCoupons = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeature(couponModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery
    res.json({ message: "Done", page: apiFeature.page, results })
})

const getCouponById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await couponModel.findById(id)
    let url = await QRCode.toDataURL(results.code)
    res.json({ message: "Done", results ,url})
})

const updateCoupon = catchAsyncError(async (req, res, next) => {
    let { id } = req.params

    let results = await couponModel.findByIdAndUpdate(id, req.body, { new: true })
    !results && next(new AppError('Coupon not found', 404))
    results && res.json({ message: "Done", results })
})

const deleteCoupon = deleteApi(couponModel)

export { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon }