const Business = require('../models/business')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, unAuthenticatedError } = require('../errors/errorsIndex')


//STAET CREATE BUSINESS
const createBusiness = async (req, res) => {
    const { name, email, password, business_desc, vendor_id, business_type } = req.body
    Business.findOne({ email }).then((err, business) => {

        const verificationCode = Math.floor(100000 + Math.random() * 900000)
        if (business) {
            return res.status(400).json({ err: "business with this email alredy exists." })
        }

        const token = jwt.sign({ 
            name, 
            email, 
            password, 
            business_desc, 
            vendor_id, 
            business_type }, 
            process.env.JWT_SECRETE, 
            { expiresIn: process.env.EXPIRE_TIME
             })


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS

            }

        })
        const mailOptions = {
            from: process.env.MAILER_AUTH_EMAIL,
            to: email,
            subject: 'Email Verification Code',
            html: `
            <body style="background-color:white; padding:5px; height:100%; width:100%>
            <div style="text-align:left; min-height:100vh; padding:20px">
         
             <h2>Hi <br/> Account almost ready</h2>
            <p>Kindly copy the and paste the verification code below to complete your account registration</p> <br/>
      
            code:  <p type="s" value=${verificationCode} style="padding:10px; font-size:30px; text-alig:left !important; color:black; background-color: inherit; font-weight:400">${verificationCode}</p>
           
            <p>If you didn't request this code, you can safely ignore this message. Someone might have typed your email address by mistaken <br/> Thanks.</p>
            </div>
            </body>
            
            `
        };
        transporter.sendMail(mailOptions, function (error, body) {
            if (error) {
                return res.json({ error: error })
            }
            res.json({ message: 'Email has be sent to you, kindly activate your accoutn to continue', code: verificationCode })
        })
    }).catch((err) => {
        console.log("Something went wrong: Registration Failed. Try again")
    })
}
//END CREATE BUSINESS

//START BUSINESS ACTIVATION
const accountActivation = async (req, res) => {
    const business = await Business.create({ ...req.body })
    const { name, email } = req.body
    const token = business.createJWT()

    var transporter1 = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }

    })
    const mailOptions1 = {
        from: process.env.MAILER_AUTH_EMAIL,
        to: email,
        subject: 'WELCOME ON BOARD',
        html: `
        <body style="background-color:#fff; padding:5px; height:100%; width:100%>
        <div style="text-align:left; min-height:100vh; padding:20px">
        <img src="https:/" alt="logo" width="60" height="60"/>
         <h2>Your Business account is Ready</h2><br/>
        <h4 style="color:aqua">How To Get Started </h4>
        <ol>
        <li>Create Business products</li>
        </ol>
  
       
        <p>  For assistance Email Us at or <a> richardadaji@gmail.com</a></p>
        </div>
        </body>
        `

    };
    transporter1.sendMail(mailOptions1, function (error, body) {
        if (error) {
            return res.json({ error: error })
        }
        console.log('Done!')
    })

    var transporter2 = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }
    })
    const mailOptions2 = {
        from: process.env.MAILER_AUTH_EMAIL,
        to: email,
        subject: 'New Business by Vendor',
        html: `
        <div style="text-align:left; min-height:100vh; padding:20px">
         <h2>name: ${name}, <br/></h2>
         <h2>email: ${email}, <br/></h2>

         <a>See more profile details</a>
         
  
      
        </div>
        `
    };
    transporter2.sendMail(mailOptions2, function (error, body) {
        if (error) {
            return res.json({ error: error })
        }
        res.status(StatusCodes.CREATED).json({ business: { name: Business.name, businessID: Business._id }, token })
    })
}
///END BUSINESS ACTIVATION

//START BUSINESS LOGIN AUTH
const businessAuth = async (req, res) => {
    const { email, password } = req.body
    const business = await Business.findOne({ email })
    if (!business) {
        throw new unAuthenticatedError('Not a REGISTERED business register now')
    }
    const isPasswordCorrect = await business.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new unAuthenticatedError('Wrong password!')
    }
    const token = business.createJWT()
    res.status(StatusCodes.CREATED).json({ token })
}
//END BUSINESS LOGIN AUTH


///START BUSINESS LOGIN
const loginBusiness = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const business = await Business.findOne({ email })
    if (!business) {
        throw new unAuthenticatedError('Not a REGISTERED business register now')
    }
    const isPasswordCorrect = await business.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new unAuthenticatedError('Wrong password!')
    }
    const token = business.createJWT()
    res.status(StatusCodes.CREATED).json({
        business: {
            name: business.business_name,
            email: business.email,
            id: business._id,
            img_url:business.img_url,
            vendor_id: business.createdBy,
            business_desc: business.business_desc,
            total_products: business.total_products

        },


        token
    })
}
///ESND BUSINESS LOGIN

//START BUSINESS PASSWORD RESET CODE
const beforePassword = async (req, res) => {
    const { email } = req.body
    const business = await Business.findOne({ email: email })

    const verificationCode = Math.floor(1000000 + Math.random() * 9000000)
    if (!business) {
        return res.status(400).json({ err: "business does not exist" })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRETE, { expiresIn: process.env.EXPIRE_TIME })


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }
    })
    const mailOptions = {
        from: process.env.MAILER_AUTH_EMAIL,
        to: email,
        subject: 'Your Password Reset Code',
        html: `
            <body style="background-color:#fff; padding:5px; height:100%; width:100%>
            <div style="text-align:left; min-height:60vh; padding:20px">
           
             <h2>Hi!, <br/></h2>
            <p>Kindly copy the and paste the verification code below to complete your password reset</p> <br/>
      
            code:  <p type="s" value=${verificationCode} style="padding:10px; font-size:30px; text-alig:left !important; color:black; background-color: inherit; font-weight:400">${verificationCode}</p>
           
            </div>
            </body>
            `
    };
    transporter.sendMail(mailOptions, function (error, body) {
        if (error) {
            return res.json({ error: error })
        }
        res.json({ message: 'Email has be sent to you, kindly reset your password', code: verificationCode })
    })

}
///END PASSWORD RESET CODE


///START CHANGE PASSWORD
const forgotPassword = async (req, res, next) => {
    const { email, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const newPassword = await bcrypt.hash(password, salt)

    const business = await Business.findOneAndUpdate({ email: email }, { password: newPassword }, {
        new: true,
        runValidators: true
    })
    if (!business) {
        return next(createCustomError(`No email  found`, 404))
    }

    var transporter2 = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }
    })
    const mailOptions2 = {
        from: process.env.MAILER_AUTH_EMAIL,
        to: email,
        subject: 'Password Reset',
        html: `
      <div style="text-align:left; min-height:60vh; padding:20px">

       <h2>Your password was changed <br/></h2>
       <p> If this is not your doing, contact us richardadaji@gmail.com</p>
       
    
    
      </div>
      `
    };
    transporter2.sendMail(mailOptions2, function (error, body) {
        if (error) {
            return res.json({ error: error })
        }
        res.status(StatusCodes.CREATED).json({ business, msg: "Password changed" })
    })

}
//END CHANGE PASSWORD

//START BUSINESS PROFILE UPDATE
const updatebusiness = async (req, res, next) => {

    const { name, business_desc, business_type, email, total_products } = req.body
    const results = []
    const files = req.files

    if (files.length == 0) {
        const business = await Business.findOneAndUpdate({ _id: req.params.business_id }, {
            name: name,
            business_desc: business_desc,
            business_type: business_type,
            total_products: total_products

        }, {
            new: true,
            runValidators: true
        })
        if (!business) {
            return next(createCustomError(`No task with email found`, 404))
        }

        var transporter2 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS
            }
        })
        const mailOptions2 = {
            from: process.env.MAILER_AUTH_EMAIL,
            to: email,
            subject: 'Profile Update',
            html: `
        
         <div style="text-align:left; min-height:60vh; padding:20px">
         
          <h2>Check it out <br/></h2>
          <p> Your business profile was updated successfully</p>
          
         </div>
         `
        };
        transporter2.sendMail(mailOptions2, function (error, body) {
            if (error) {
                return res.json({ error: error })
            }
            res.status(StatusCodes.CREATED).json({ business })
        })

    }
    files.forEach(async (hhh, index) => {
        const filepath = hhh.path
        const result = await cloudinary.v2.uploader.upload(filepath, {
            folder: "vendors/business",
            width: 200,
            crop: "scale"
        })
        const business = await Business.findOneAndUpdate({ _id: req.params.business_id }, {
            name: name,
            img_url: results[0].secure_url,
            business_desc: business_desc,
            business_type: business_type,
            total_products: total_products

        }, {
            new: true,
            runValidators: true
        })
        if (!business) {
            return next(createCustomError(`No task with email found`, 404))
        }

        var transporter2 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS
            }
        })
        const mailOptions2 = {
            from: process.env.MAILER_AUTH_EMAIL,
            to: email,
            subject: 'Profile Update',
            html: `
     
      <div style="text-align:left; min-height:60vh; padding:20px">
      
       <h2>Check it out <br/></h2>
       <p> Your business profile was updated successfully</p>
       
      </div>
      `
        };
        transporter2.sendMail(mailOptions2, function (error, body) {
            if (error) {
                return res.json({ error: error })
            }
            res.status(StatusCodes.CREATED).json({ business })
        })
    })
}
//STOPE BUSINESS PROFILE UPDATE

//DELETE BUSINESS
const deleteBusiness = async (req, res) => {
    const business = await Business.findOneAndDelete({ _id: req.params.business_id })
    res.status(StatusCodes.OK).json({ business })
}
/// END DELETTE BUSINESS


module.exports = {

    loginBusiness,
    createBusiness,
    businessAuth,
    accountActivation,
    updatebusiness,
    beforePassword,
    forgotPassword,
    deleteBusiness
}
