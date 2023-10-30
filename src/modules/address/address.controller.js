import { AppError } from "../../utils/services/AppError.js"
import catchAsyncError from "../../utils/midlleware/catchAsyncError.js"
import { userModel } from "../../../db/models/user.model.js"

const addAddress = 
catchAsyncError(
    async (req, res, next) => {

    let results = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { address: req.body } },
        { new: true });
    !results && next(new AppError("can't find product", 404));
    results && res.json({ message: "Done", results: results.address });
}
);


const deleteAddress = catchAsyncError(async (req, res, next) => {

    let results = await userModel.findByIdAndUpdate(req.user._id, { $pull: { address: { _id: req.body.address } } },
        { new: true });
    !results && next(new AppError("can't find product", 404));
    results && res.json({ message: "Done", results: results.address });
});


const getAllAddresses = catchAsyncError(async (req, res, next) => {

    let results = await userModel.findOne({ _id: req.user._id })
    !results && next(new AppError("can't find product", 404));
    results && res.json({ message: "Done", results: results.address });
});

export { addAddress, deleteAddress, getAllAddresses };