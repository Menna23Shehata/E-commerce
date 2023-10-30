import { AppError } from "../../utils/services/AppError.js"
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js"
import { userModel } from "../../../db/models/user.model.js"

const addToWishList = catchAsyncError(async (req, res, next) => {
    let { product } = req.body;

    let results = await userModel.findOneAndUpdate(req.user._id, { $addToSet: { wishList: product } },
        { new: true });
    !results && next(new AppError("can't find product", 404));
    results && res.json({ message: "Done", results });
}

);

const deleteFromWishList = catchAsyncError(async (req, res, next) => {
    let { product } = req.body;

    let results = await userModel.findOneAndUpdate(req.user._id, { $pull: { wishList: product } },
        { new: true });
    !results && next(new AppError("can't find product", 404));
    results && res.json({ message: "Done", results });
}

);

const getWishList = catchAsyncError(async (req, res, next) => {

    let results = await userModel.findOne({ _id: req.user._id })
    !results && next(new AppError("can't find product", 404));
    results && res.json({ message: "Done", results: results.wishList });
}

);

export { addToWishList, deleteFromWishList, getWishList };