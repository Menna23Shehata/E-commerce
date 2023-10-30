import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        required: true,
        trim: true,
        minLength: [2, 'name is too short']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref:"Category"
    }

}, { timestamps: true })

export const subCategoryModel = mongoose.model("SubCategory", subCategorySchema)