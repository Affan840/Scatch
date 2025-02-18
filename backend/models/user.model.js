import mongoose, { Mongoose } from "mongoose"


const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    contact: Number,
    picture: String
},{ timestamps: true })

export const User = mongoose.model('User', userSchema)