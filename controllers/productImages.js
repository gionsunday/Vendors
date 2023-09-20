const fs = require('fs')
const path = require('path')
const multer = require('multer')
const imgModel = require('../models/productImage')
const cloudinary = require('../utils/cloudinary')
const {StatusCodes} = require('http-status-codes')
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, '/uploads')
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({dest: '../uploads'})


const getProductImage = async (req, res) =>{
    const profileImage = await imgModel.find({uploadedBy:req.params.uploadedBy})
    
    res.status(StatusCodes.OK).json({ profileImage})
    
    
}

const uploadProductImage =async  (req, res, next) =>{

const files = req.files
console.log(files)
const filepath = files[0].path
console.log(filepath)
const result = await cloudinary.v2.uploader.upload(filepath)
 const {secure_url, name} = result
        req.body.img_url = secure_url
        const productImage = await imgModel.create({...req.body})
        res.status(StatusCodes.CREATED).json({productImage})
    
}


const deleteProductImage = async (req, res) =>{
    const profileImage = imgModel.findOneAndDelete({_id:req.params.image_id})
    .then((image, err) =>{
        if(err){console.log("can not find image at the moment")}
        res.json({profileImage})
    })
}


module.exports = {
    getProductImage,
    uploadProductImage,
    deleteProductImage
}


