
const express = require('express')
const router = express.Router()

const multer = require('multer')


const upload = multer({dest: 'uploads'})

const {loginBusiness, createBusiness, businessAuth,
         beforePassword, forgotPassword, accountActivation, deleteBusiness,
          updatebusiness} = require('../controllers/business')
const authMiddleware = require('../middleware/businessAuth')

router.post('/createbusiness', createBusiness)

router.post('/forgotpassword', forgotPassword)
router.post('/beforeforgot', beforePassword)
router.post('/accountactivation', accountActivation )
router.post('/login/:authtoken', authMiddleware, loginBusiness)
router.delete('/delete/:business_id', deleteBusiness)
router.post('/dashboard', businessAuth)
router.put('/updatebusiness/:business_id', upload.array('images'),updatebusiness)

module.exports = router
