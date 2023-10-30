import { subCategoryModel } from "../../../../db/models/subCategory.model.js"
import slugify from "slugify"
import { AppError } from "../../../utils/services/AppError.js"
import catchAsyncError from "../../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../../utils/handlers/refactor.handler.js"
import ApiFeature from "../../../utils/APIFeatures.js"

const createSubCategory = catchAsyncError(async (req, res, next) => {
    let { name, categoryId } = req.body
    let results = new subCategoryModel({ name, slug: slugify(name), category: categoryId })
    await results.save()
    res.status(201).json({ message: "Done", results })
})


const getAllSubCategories = catchAsyncError(async (req, res, next) => {
    let filters = {}
    if (req.params && req.params.id) {
        filters = { category: req.params.id }
    }
    let apiFeature = new ApiFeature(subCategoryModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery
    // let results = await subCategoryModel.find(filters)
    res.json({ message: "Done", page: apiFeature.page, results })
})

const getSubCategoryById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await subCategoryModel.findById(id)
    res.json({ message: "Done", results })
})

const updateSubCategory = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let { name, categoryId } = req.body
    let results = await subCategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name), category: categoryId }, { new: true })
    !results && next(new AppError('subCategory not found', 404))
    results && res.json({ message: "Done", results })
})

const deleteSubCategory = deleteApi(subCategoryModel)

export {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
}