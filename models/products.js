const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        trim: true,
    },

    email: {
        type: String,
        trim: true,
    },

    product_desc: {
        trim: true,
        type: String,
        default: "No Description",
    },
    product_category: {
        trim: true,
        type: String,
        default: "All",
    },
     product_quantity: {
        trim: true,
        type: Number,
        default: 0,
    },
    product_price: {
        trim: true,
        type: Number,
        default: 0,
    },
    createdBy:{
        
        trim: true,
        type: String,
        required: true
    },
    img_url_1:{
        type:String,
        trim: true,
        default:""
    },
    img_url_2:{
        type:String,
        trim: true,
        default:""
    },
    img_url_3:{
        type:String,
        trim: true,
        default:""
    }



}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)
