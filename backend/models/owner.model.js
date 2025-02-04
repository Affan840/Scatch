import mongoose from "mongoose"

const ownerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    products: {
        type: Array,
        default: []
    },
    picture: String,
    gstpk: String,
})

export const Owner = mongoose.model('Owner', ownerSchema)