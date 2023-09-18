const express = require('express')
const router = express.Router()
const multer = require('multer')


const upload = multer({dest: 'uploads'})

const {
    getProducts,
    getSingleProduct, 
    createProduct, 
    getBusinessProducts, 
    deleteProduct, 
    updateProduct
} = require('../controllers/products')


router.post('/create', createProduct)
router.put('/update/:product_id',  upload.array('images'), updateProduct)
router.get('/getall', getProducts)
router.get('/getallbusinessproducts/:createdBy', getBusinessProducts)
router.delete('/delete/:product_id', deleteProduct)
router.get('/getsingle/:product_id', getSingleProduct)


module.exports = router

