import catchAsyncError from "../midlleware/catchAsyncError.js"
import { AppError } from "../services/AppError.js"


const deleteApi = (model) =>{
    return catchAsyncError(async (req, res, next) => {
        let { id } = req.params
        let results = await model.findByIdAndDelete(id)
        !results && next(new AppError('category not found', 404))
        results && res.json({ message: "Done", results })
    })
}

export default deleteApi