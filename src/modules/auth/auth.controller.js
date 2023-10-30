import { userModel } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/services/AppError.js"
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = catchAsyncError(async (req, res, next) => {
    let isFound = await userModel.findOne({ email: req.body.email });
    if (isFound) return next(new AppError("Email already exist", 409))

    let user = new userModel(req.body)
    await user.save()

    res.json({ message: "added", user })
}

)

export const signIn = catchAsyncError(async (req, res, next) => {
    let { email, password } = req.body;
    let isFound = await userModel.findOne({ email });
    const match = await bcrypt.compare(password, isFound.password);

    if (isFound && match) {
        let token = jwt.sign({ name: isFound.name, userId: isFound._id, role: isFound.role }, "tokenKey")
        return res.json({ message: "success", token })
    }
    next(new AppError("incorrect email or password", 401))

});

export const protectRoutes = catchAsyncError(async (req, res, next) => {
    let { token } = req.headers
    if (!token) return next(new AppError('please provide token', 401))

    let decoded = await jwt.verify(token, 'tokenKey')

    let user = await userModel.findById(decoded.userId)
    if (!user) return next(AppError('invalid user', 404))

    if (user.changePasswordAt) {
        // to convert from milliseconds to milliseconds
        let changePasswordTime = parseInt(user.changePasswordAt.getTime() / 1000);

        if (changePasswordTime > decoded.iat) return next(new AppError("token invalid", 401));
        console.log(changePasswordTime + ' ====> ' + decoded.iat);
    }

    req.user = user;
    next()
})


export const allowedTo = (...roles) => {
    // console.log(roles);
    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError('not authorized user, your role is just a '+req.user.role, 403))
        next()
    })
}