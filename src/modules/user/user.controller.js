import { userModel } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/services/AppError.js"
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../utils/handlers/refactor.handler.js"
import ApiFeature from "../../utils/APIFeatures.js"


const createUser = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email })
    if (user) return next(new AppError('email is already in use', 409))

    let results = new userModel(req.body)
    await results.save()

    res.status(201).json({ message: "Done", results })
})


const getAllUsers = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeature(userModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery
    res.json({ message: "Done", page: apiFeature.page, results })
})

const getUserById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await userModel.findById(id)
    res.json({ message: "Done", results })
})

const updateUser = catchAsyncError(async (req, res, next) => {
    let { id } = req.params

    let results = await userModel.findByIdAndUpdate(id, req.body, { new: true })
    !results && next(new AppError('User not found', 404))
    results && res.json({ message: "Done", results })
})

const changePassword = catchAsyncError(async (req, res, next) => {
    let { id } = req.params

    req.body.changePasswordAt = Date.now()
    
    let results = await userModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
    !results && next(new AppError('User not found', 404))
    results && res.json({ message: "Done", results })
})

const deleteUser = deleteApi(userModel)

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, changePassword }