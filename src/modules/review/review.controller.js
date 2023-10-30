import { reviewModel } from "../../../db/models/review.model.js"
import { AppError } from "../../utils/services/AppError.js"
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../utils/handlers/refactor.handler.js"
import ApiFeature from "../../utils/APIFeatures.js"


const createReview = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user._id

    let isReview = await reviewModel.findOne({ user: req.user._id, product: req.body.product })
    if (isReview) return next(new AppError('commented before', 409))

    let results = new reviewModel(req.body)
    await results.save()

    res.status(201).json({ message: "Done", results })
})


const getAllReviews = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeature(reviewModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery
    res.json({ message: "Done", page: apiFeature.page, results })
})

const getReviewById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await reviewModel.findById(id)
    res.json({ message: "Done", results })
})

const updateReview = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    //                                               review id,  user id
    let results = await reviewModel.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true })
    !results && next(new AppError('Review not found or you are not authorized to perform this action', 404))
    results && res.json({ message: "Done", results })
})

const deleteReview = deleteApi(reviewModel)

export { createReview, getAllReviews, getReviewById, updateReview, deleteReview }