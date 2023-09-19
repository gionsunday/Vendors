const User = require('../models/user')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const {StatusCodes} = require('http-status-codes')
const cloudinary = require('../utils/cloudinary')
const { BadRequestError, unAuthenticatedError } = require('../errors/errorsIndex')


//START EMAIL VERIFICATION
const email_verification = async (req, res) =>{
    const {email} = req.body
    User.findOne({email}).then((err, user) =>{
           
        const verificationCode = Math.floor(100000 + Math.random() * 900000 )
        if(user){
           return res.status(400).json({err: "User with this email already exists."})
        }

        var transporter = nodemailer.createTransport({
            service :'gmail',
            auth:{
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS
            }
        })
        const mailOptions = {
            from: process.env.MAILER_AUTH_EMAIL,
            to: email,
            subject: ' Email Verification Code',
            html: `
            <body style="background-color:white; padding:5px; height:100%; width:100%>
            <div style="text-align:left; min-height:100vh; padding:20px">
         
         
             <h4>Email Verification Code</>
             <h2>Your account is almost ready</h2>
            <p>Kindly copy the and paste the verification code below to complete your account registration</p> <br/>
      
            code:  <p type="s" value=${verificationCode} style="padding:10px; font-size:30px; text-alig:left !important; color:black; background-color: inherit; font-weight:400">${verificationCode}</p>
           
            <p>If you didn't request this code, you can safely ignore this message. Someone might have typed your email address by mistaken <br/> Thanks.</p>
            </div>
            </body>
            
            `
        };
        transporter.sendMail(mailOptions, function(error, body){
            if(error){
                return res.json({error: error})
            }
            res.json({message: 'Email has be sent to you, kindly activate your accoutn to continue', code:verificationCode })
        })
    }).catch((err) =>{
          console.log("Something went wrong: Registration Failed. Try again")
    })
}

///END EMAIL VERIFICATION

//START REGISTRATION
const register = async (req, res) => {
    const {name, email, password, phone} = req.body
       User.findOne({email}).then((err, user) =>{
           
        const verificationCode = Math.floor(100000 + Math.random() * 900000 )
        if(user){
           return res.status(400).json({err: "User with this email alredy exists."})
        }

        const token = jwt.sign({name, email, password, phone}, process.env.JWT_SECRETE, {expiresIn: process.env.EXPIRE_TIME})
        

        var transporter = nodemailer.createTransport({
            service :'gmail',
            auth:{
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS
                
            }
        
        })
        const mailOptions = {
            from: process.env.MAILER_AUTH_EMAIL,
            to: email,
            subject: '  Email Verification Code',
            html: `
            <body style="background-color:white; padding:5px; height:100%; width:100%>
            <div style="text-align:left; min-height:100vh; padding:20px">
         
         
             <h2>Hi ${name}. <br/> Account is almost ready.</h2>
            <p>Kindly copy the and paste the verification code below to complete your account registration</p> <br/>
      
            code:  <p type="s" value=${verificationCode} style="padding:10px; font-size:30px; text-alig:left !important; color:black; background-color: inherit; font-weight:400">${verificationCode}</p>
           
            <p>If you didn't request this code, you can safely ignore this message. Someone might have typed your email address by mistaken <br/> Thanks.</p>
            </div>
            </body>
            
            `
        };
        transporter.sendMail(mailOptions, function(error, body){
            if(error){
                return res.json({error: error})
            }
            res.json({message: 'Email has be sent to you, kindly activate your accoutn to continue', code:verificationCode })
        })
    }).catch((err) =>{
          console.log("Something went wrong: Registration Failed. Try again")
    })
}
//END REGISTRATION

//START ACCOUNT ACTIVATION
const accountActivation = async (req, res) => {
    

    const user = await User.create({...req.body})
    const {name, email} = req.body
    const token = user.createJWT()

   var transporter1 = nodemailer.createTransport({
        service :'gmail',
            auth:{
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
         <h2>Hi ${name}!, <br/> Your Account is Ready</h2><br/>
        <h4 style="color:aqua">How To Get Started </h4>
        <ol>
        <li>Register</li>
        <li>Login</li>
        <li>Create Business</li>
        <li>Create Business products</li>
        </ol>
  
       
        <p>  For assistance Email Us at or <a> richardadaji@gmail.com</a></p>
        </div>
        </body>
        `
        
    };
    transporter1.sendMail(mailOptions1, function(error, body){
        if(error){
            return res.json({error: error})
        }
        console.log('Done!')
    })

    var transporter2 = nodemailer.createTransport({
        service :'gmail',
            auth:{
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS
            }
    })
    const mailOptions2 = {
        from: process.env.MAILER_AUTH_EMAIL,
        to: "reanazrab@gmail.com",
        subject: 'New Vendor',
        html: `
        <div style="text-align:left; min-height:100vh; padding:20px">
         <h2>name: ${name}, <br/></h2>
         <h2>email: ${email}, <br/></h2>

         <a>See more profile details</a>
         
  
      
        </div>
        `
    };
    transporter2.sendMail(mailOptions2, function(error, body){
        if(error){
            return res.json({error: error})
        }
        res.status(StatusCodes.CREATED).json({user:{name:user.name, userID:user._id}, token })
    })
}
//END ACCOUNT ACTIVATION

//START USER LOG IN AUTHENTICATION
const userAuth = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user){
        throw new unAuthenticatedError('Not a REGISTERED user register now')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    
    if(!isPasswordCorrect){
     throw new unAuthenticatedError('Wrong password!')
 }
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token })
}
//END USER LOG IN AUTHENTICATION


//START LOGIN
const login = async (req, res) => {
   const {email, password} = req.body
   if(!email || !password){
       throw new BadRequestError('Please provide email and password')
   }

   const user =  await User.findOne({email}) 
   if(!user){
       throw new unAuthenticatedError('Not a REGISTERED user register now')
   }
   const isPasswordCorrect = await user.comparePassword(password)
   
   if(!isPasswordCorrect){
    throw new unAuthenticatedError('Wrong password!')
}
   const token = user.createJWT()
   res.status(StatusCodes.CREATED).json({
    user:{
        name:user.name, 
        email:user.email,
        id:user._id,
        total_business_no : user.total_business,
        total_products:user.total_products

    },
    

    token })
}
///END LOG IN

//START PASSWORD RECOVERY CODE
const beforePassword = async (req, res) => {
    const {email} = req.body
       const user = await User.findOne({email:email})
           
        const verificationCode = Math.floor(1000000 + Math.random() * 9000000 )
        if(!user){
           return res.status(400).json({err: "User does not exist"})
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRE_TIME} )
        

        var transporter = nodemailer.createTransport({
            service :'gmail',
            auth:{
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
        transporter.sendMail(mailOptions, function(error, body){
            if(error){
                return res.json({error: error})
            }
            res.json({message: 'Email has be sent to you, kindly reset your password', code:verificationCode })
        })

}
///END PASSWORD RECOVER CODE


//START CHANGE PASSWORD
const forgotPassword = async (req,res, next) =>{
    const {email, password} = req.body
    
    const salt = await bcrypt.genSalt(10)
    const newPassword = await bcrypt.hash(password, salt)
    
    const user = await User.findOneAndUpdate({email:email}, {password:newPassword}, {
        new:true,
        runValidators:true
    })
    if(!user){
        return next(createCustomError(`No email  found`, 404))
    }

    var transporter2 = nodemailer.createTransport({
        service :'gmail',
            auth:{
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
    transporter2.sendMail(mailOptions2, function(error, body){
      if(error){
          return res.json({error: error})
      }
      res.status(StatusCodes.CREATED).json({user, msg:"Password changed" })
    })

}
//END CHANGE PASSWORD

//START USER PROFILE UPDATE
const updateUser = async (req,res, next) =>{
  
    const {total_business, total_products, email, name } = req.body
    const {userid} = req.params
    const results = []
    const files = req.files
     if(files.length == 0){
        const user = await User.findOneAndUpdate({_id:userid}, {
          name:name,
            total_business:total_business,
            total_products:total_products
       
       }, {
           new:true,
           runValidators:true
       })
       if(!user){
           return next(createCustomError(`No user with email found`, 404))
       }
   
       var transporter2 = nodemailer.createTransport({
           service :'gmail',
               auth:{
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
          <p> Your profile was updated successfully</p>
         </div>
         `
       };
       transporter2.sendMail(mailOptions2, function(error, body){
         if(error){
             return res.json({error: error})
         }
         res.status(StatusCodes.CREATED).json({user })
       })
     }
    files.forEach(async (hhh, index) =>{
    const filepath = hhh.path
    const result = await cloudinary.v2.uploader.upload(filepath,{
        folder:"vendors",
        width:200,
        crop:"scale"
    })
        results.push(result)
        const user = await User.findOneAndUpdate({email:email}, {
         img_url:results[0].secure_url,
         total_business:total_business,
         total_products:total_products
    
    }, {
        new:true,
        runValidators:true
    })
    if(!user){
        return next(createCustomError(`No user with email found`, 404))
    }

    var transporter2 = nodemailer.createTransport({
        service :'gmail',
            auth:{
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
       <p> Your profile was updated successfully</p>
      </div>
      `
    };
    transporter2.sendMail(mailOptions2, function(error, body){
      if(error){
          return res.json({error: error})
      }
      res.status(StatusCodes.CREATED).json({user })
    })
})

}

///END USER PROFILE UPDATE

module.exports ={
      register, 
      login,
      email_verification,  
      
      accountActivation, 
      userAuth, 
      beforePassword,
      updateUser,
      forgotPassword
}
