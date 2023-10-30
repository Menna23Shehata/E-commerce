import express from "express"
import * as userController from "./user.controller.js"

const userRouter = express.Router()

userRouter.route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser)

userRouter.route("/:id")
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

userRouter.patch('/changePassword/:id',userController.changePassword)

export default userRouter