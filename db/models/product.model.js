import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: [true, 'title is required'],
        required: true,
        trim: true,
        minLength: [2, 'title is too short']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    imgCover: String,
    images: [String],
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: 0
    },
    priceAfterDiscount: {
        type: Number,
        min: 0
    },
    ratingAverage: {
        type: Number,
        max: [5, 'ratingAverage must be less than 5'],
        min: [1, 'ratingAverage must be greater than 1']
    },
    ratingCount: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        maxLength: [300, 'description is too long'],
        minLength: [3, 'description is too short'],
        required: [true, 'description is required'],
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
        required: [true, 'product quantity is required']
    },
    sold: {
        type: Number,
        default: 0,
        min: 0,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: [true, 'product category is required']
    },
    subCategory: {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
        required: [true, 'product subCategory is required']
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        required: [true, 'product brand is required']
    }
}, { timestamps: true, toJSON:{virtuals:true} ,toObject:{virtuals:true}})

// mongoose hooks (mongoose middleware)
productSchema.post("init", (doc) => {
    doc.imgCover = process.env.BASE_URL + `/product/` + doc.imgCover
    if(doc.images) doc.images.map(path => process.env.BASE_URL + `/product/` +path)
})

productSchema.virtual("productReviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"product"
})

productSchema.pre(/^find/,function(){
    this.populate("productReviews")
})

export const productModel = mongoose.model("Product", productSchema)