
const express = require('express')
const router = express.Router()
const multer = require('multer')


const upload = multer({dest: 'uploads'})
const {getProductImage, deleteProductImage, uploadProductImage} = require("../controllers/productImages")


router.post('/uploadimage', upload.array('images'), uploadProductImage)
router.get('/getimage/:uploadedBy', getProductImage)
router.get('/getimage/:image_id', deleteProductImage)

module.exports = router
