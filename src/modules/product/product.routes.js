import express from "express"
import * as productController from "./controller/product.controller.js"
import { uploadMixedFiles } from "../../utils/midlleware/fileUploader.js"
import { allowedTo, protectRoutes } from "../auth/auth.controller.js"


const productRouter = express.Router()

productRouter.route("/")
    .get(productController.getAllProducts)
    .post(uploadMixedFiles('product', [{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 8 }]), protectRoutes,
        allowedTo('user'),
        productController.createProduct)

productRouter.route("/:id")
    .get(productController.getProductById)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct)

export default productRouter