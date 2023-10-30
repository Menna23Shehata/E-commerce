import { AppError } from "../utils/services/AppError.js"
import authRouter from "./auth/auth.routes.js"
import brandRouter from "./brand/brand.routes.js"
import categoryRouter from "./category/category.routes.js"
import productRouter from "./product/product.routes.js"
import reviewRouter from "./review/review.routes.js"
import subCategoryRouter from "./subCategory/subCategory.routes.js"
import userRouter from "./user/user.routes.js"
import globalErrorHandler from '../utils/midlleware/globalErrorHandler.js'
import wishListRouter from "./wishList/wishList.routes.js"
import couponRouter from "./coupon/coupon.routes.js"
import cartRouter from "./cart/cart.routes.js"
import addressRouter from "./address/address.routes.js"
import orderRouter from "./order/order.routes.js"

export function init(app){
    app.use("/api/v1/category", categoryRouter)
    app.use("/api/v1/subcategory", subCategoryRouter)
    app.use('/api/v1/brand', brandRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/review', reviewRouter)
    app.use('/api/v1/wishlist', wishListRouter)
    app.use('/api/v1/coupon', couponRouter)
    app.use('/api/v1/cart', cartRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/order', orderRouter)

    // wrong path
    app.all("*", (req, res, next) => {
        next(new AppError(`can't find this route ${req.originalUrl}`, 404))
    })

    app.use(globalErrorHandler)
}