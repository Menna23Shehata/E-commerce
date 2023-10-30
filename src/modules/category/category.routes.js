import express from "express"
import * as categoryController from "./controller/category.controller.js"
import subCategoryRouter from "../subCategory/subCategory.routes.js"
import { validation } from "../../utils/midlleware/validation.js"
import { createCategorySchema, getCategoryByIdSchema } from "./categories.validation.js"
import { uploadSingleFile } from "../../utils/midlleware/fileUploader.js"


const categoryRouter = express.Router()

categoryRouter.use("/:id/subcategory", subCategoryRouter)

categoryRouter.route("/")
    .get(categoryController.getAllCategories)
    .post(uploadSingleFile('category','image'), validation(createCategorySchema), categoryController.createCategory)

categoryRouter.route("/:id")
    .get(validation(getCategoryByIdSchema), categoryController.getCategoryById)
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

export default categoryRouter