import { brandModel } from "../../../../db/models/brand.model.js"
import slugify from "slugify"
import { AppError } from "../../../utils/services/AppError.js"
import catchAsyncError from "../../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../../utils/handlers/refactor.handler.js"
import ApiFeature from "../../../utils/APIFeatures.js"


const createBrand = catchAsyncError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    req.body.logo = req.file.filename

    let results = new brandModel(req.body)
    await results.save()
    
    res.status(201).json({ message: "Done", results })
})


const getAllBrands = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeature(brandModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery
    res.json({ message: "Done", page: apiFeature.page, results })
})

const getBrandById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await brandModel.findById(id)
    res.json({ message: "Done", results })
})

const updateBrand = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    req.body.slug = slugify(req.body.name)
    if(req.file) req.body.logo = req.file.filename
    let results = await brandModel.findByIdAndUpdate(id, req.body, { new: true })
    !results && next(new AppError('Brand not found', 404))
    results && res.json({ message: "Done", results })
})

const deleteBrand = deleteApi(brandModel)

export {
    createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand
}