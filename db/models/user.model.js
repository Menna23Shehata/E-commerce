import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
        minLength: [2, 'name is too short']
    },
    email: {
        type: String,
        unique: [true, 'email is used before'],
        required: [true, 'email is required'],
        minLength: [2, 'email is too short'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password is too short']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    profilePic: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    changePasswordAt: Date,
    wishList: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product",
        default: 0,
        maxLength: [25, 'you exceeded the wishList limit']
    }],
    address: [{
        city: String,
        street: String,
        phone: String
    }]

}, { timestamps: true })

// mongoose hooks (mongoose middleware):

// 1- document middleware
userSchema.pre('save', function () {
    // console.log(this);
    this.password = bcrypt.hashSync(this.password, Number(process.env.SALT_ROUNDS))
})

// 2- query middleware
userSchema.pre('findOneAndUpdate', function () {
    // console.log(this);
    this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.SALT_ROUNDS))
})

export const userModel = mongoose.model("User", userSchema)