import slugify from "slugify"
import { AppError } from "../../../utils/services/AppError.js"
import catchAsyncError from "../../../utils/midlleware/catchAsyncError.js"
import deleteApi from "../../../utils/handlers/refactor.handler.js"
import { productModel } from "../../../../db/models/product.model.js"
import ApiFeature from "../../../utils/APIFeatures.js"


const createProduct = catchAsyncError(async (req, res, next) => {
    req.body.slug = slugify(req.body.title)
    req.body.imgCover = req.files.imgCover[0].filename
    req.body.images = req.files.images.map((img) => img.filename)
    // console.log(req.files,"req.files");

    let results = new productModel(req.body)
    await results.save()
    res.status(201).json({ message: "Done", results })
})


const getAllProducts = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeature(productModel.find(), req.query).pagination().sort().search().fields().filter()
    let results = await apiFeature.mongooseQuery

    res.json({ message: "Done", page: apiFeature.page, results })
})

const getProductById = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let results = await productModel.findById(id)
    res.json({ message: "Done", results })
})

const updateProduct = catchAsyncError(async (req, res, next) => {
    let { id } = req.params
    let { title } = req.body
    if (req.body.title) {
        req.body.slug = slugify(title)
    }
    let results = await productModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
    !results && next(new AppError('Product not found', 404))
    results && res.json({ message: "Done", results })
})

const deleteProduct = deleteApi(productModel)


export {
    createProduct, getAllProducts, getProductById, updateProduct, deleteProduct
}