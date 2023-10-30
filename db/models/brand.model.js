import mongoose, { model } from "mongoose";

const brandSchema = new mongoose.Schema({
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
    logo:String
})

brandSchema.post("init", (doc) => {
    doc.logo = process.env.BASE_URL + `/brand/` + doc.logo
})

export const brandModel = mongoose.model("Brand",brandSchema)