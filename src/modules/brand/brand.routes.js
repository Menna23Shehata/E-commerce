import express from "express"
import * as brandController from "./controller/brand.controller.js"
import { validation } from "../../utils/midlleware/validation.js"
import { createBrandSchema, updateBrandSchema } from "./brands.validation.js"
import { uploadSingleFile } from "../../utils/midlleware/fileUploader.js"
// import subbrandRouter from "../subCategory/subCategory.routes.js"

const brandRouter = express.Router()

// brandRouter.use("/:id/subcategory", subbrandRouter)

brandRouter.route("/")
    .get(brandController.getAllBrands)
    .post(uploadSingleFile('brand', 'logo'), validation(createBrandSchema), brandController.createBrand)

brandRouter.route("/:id")
    .get(brandController.getBrandById)
    .put(uploadSingleFile('brand', 'logo'), validation(updateBrandSchema), brandController.updateBrand)
    .delete(brandController.deleteBrand)

export default brandRouter