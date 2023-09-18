
const express = require('express')
const router = express.Router()

const multer = require('multer')


const upload = multer({dest: 'uploads'})

const {login, register, email_verification, userAuth,
         beforePassword, forgotPassword, accountActivation, 
          updateUser} = require('../controllers/auth')
const authMiddleware = require('../middleware/auth')

router.post('/register', register)
router.post('/verify/email', email_verification)
router.post('/forgotpassword', forgotPassword)
router.post('/beforeforgot', beforePassword)
router.post('/register/accountactivation', accountActivation )
router.post('/login', authMiddleware, login)
router.post('/user/auth', userAuth)
router.post('/updateuser',  upload.array('images'), updateUser)


module.exports = router
