import { categoryModel } from "../../../../db/models/category.model.js"
import slugify from "slugify"
import { AppError } from "../../../utils/services/AppError.js"
import catchAsyncError from "../../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../../utils/handlers/refactor.handler.js"
import ApiFeature from "../../../utils/APIFeatures.js"


const createCategory = catchAsyncError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    req.body.image = req.file.filename

    let results = new categoryModel(req.body)
    await results.save()

    res.status(201).json({ message: "Done", results })
})


const getAllCategories = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeature(categoryModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery
    res.json({ message: "Done", page: apiFeature.page, results })
})

const getCategoryById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await categoryModel.findById(id)
    res.json({ message: "Done", results })
})

const updateCategory = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let { name } = req.body
    let results = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
    !results && next(new AppError('category not found', 404))
    results && res.json({ message: "Done", results })
})

const deleteCategory = deleteApi(categoryModel)


export {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory
}