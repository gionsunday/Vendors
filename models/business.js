const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()





const BusinessSchema = new mongoose.Schema({
    business_name: {
        type: String,
        trim: true,
        required: [true, 'please provide an name'],
        maxlength: [50, "name must not be greater than 20 characters"]
    },
    email: {
        type: String,
        unique: false,
        trim: true,
        required: [true, 'please provide an email'],
    },
   
    password: {
        type: String,
        trim: true,
        required: [true, 'please provide an password'],
    },
    createdBy:{
        type:String,
        trim:true,
        require:true
    },
    img_url:{
        type:String,
        trim:true
    },
    business_desc:{
        type:String,
        trim:true

    },
    business_type:{
        type:String,
        trim:true
    },
   
    total_products: {
        type: Number,
        trim: true,
        default:0,
    },
   
   
}, { timestamps: true })

BusinessSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})
BusinessSchema.pre('save', async function () {
    const id = this._id
    const businessID =  id.toString();
    this.business_id = businessID.slice(12,50);

})


BusinessSchema.methods.createJWT = function () {
    return jwt.sign({ 
        businessID: this._id, 
        business_name: this.business_name, 
        email:this.enail },  
        process.env.JWT_SECRETE, 
        {expiresIn: process.env.EXPIRE_TIME
        })
}


BusinessSchema.methods.comparePassword = async function (candidatesPassword) {
    const isMatch = await bcrypt.compare(candidatesPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Business', BusinessSchema)
