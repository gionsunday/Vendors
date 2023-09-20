const { BadRequestError } = require("../errors/errorsIndex")
require('dotenv').config()
const nodemailer = require('nodemailer')
const notFoundMiddlewareError = require('../middleware/notfound')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary')
const Product = require('../models/products')

//STRAT GET ALL PRODUCTS
const getProducts = async (req, res) => {
  const { createdBy } = req.body
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products })
}
//END GET ALL PRODUCTS

//START GET ALL PRODUCTS FOR EACH BUSINESS
const getBusinessProducts = async (req, res) => {
  //const { createdBy } = req.params
  const products = await Product.find({ createdBy: req.params.createdBy })
  res.status(StatusCodes.OK).json({ products })
}
//END GET ALL PRODUCTS


//START GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
//  const { product_id } = req.params
  const product = await Product.find({ _id: req.params.product_id })
  res.status(StatusCodes.OK).json({ product })
}
//END GET SINGLE PRODUCT


//END CREATE PRODUCT
const createProduct = async (req, res) => {
  const { email, product_name, product_desc, product_quantity, product_price } = req.body

  const product = await Product.create(req.body)
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
    subject: 'New Product Added',
    html: `
<div style="text-align:left; min-height:60vh; padding:20px">
 <p>You Added a product to your business. Details are below.</p>
 <p></p>
<h2>Product Name: ${product_name} <br/></h2>
<h2>Product Price: ${product_price}USDT <br/></h2>
<h2>Product Description: ${product_desc} USDT<br/></h2>
<h2>Product Quantity: ${product_quantity}<br/></h2>
<h3>Login to see more details</h3>

</div>
`
  };
  transporter2.sendMail(mailOptions2, function (error, body) {
    if (error) {
      return res.json({ error: error })
    }

    res.status(StatusCodes.CREATED).json({ product })
  })
}
//END CREATE PRODUCT


///START PRODUCT UPDATE
const updateProduct = async (req, res, next) => {
  const results = []
  const files = req.files

  if (files.length == 0) {

    const {
      product_name,
      email,
      product_price,
      product_quantity,
      product_desc,
      product_category,
    } = req.body
    
    const product = await Product.findOneAndUpdate({ _id: req.params.product_id }, {
      product_name: product_name,
      product_price: product_price,
      product_quantity: product_quantity,
      product_desc: product_desc,
      product_category: product_category,


    }
      , {
        new: true,
        runValidators: true
      })
    if (!product) {
      return next(createCustomError(`Product Not found`, 404))
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
      subject: 'Product Status Update',
      html: `
   
    <div style="text-align:left; min-height:60vh; padding:20px">
    
     <h2> Your Product Update <br/></h2>
     <p>Product Name: ${product_name}</p
     <p>Product Quantity: ${product_quantity}</p>
     <p>Product Unit Price: ${product_price}</p
    </div>
    `
    };
    transporter2.sendMail(mailOptions2, function (error, body) {
      if (error) {
        return res.json({ error: error })
      }

      res.status(StatusCodes.CREATED).json({ msg: "Product Updated", product })
    })

  }

  files.forEach(async (hhh, index) => {
    const filepath = hhh.path
    const result = await cloudinary.v2.uploader.upload(filepath, {
      folder: "vendors/business",
      width: 500,
      crop: "scale"
    })
    results.push(result)
    console.log(results)
    const {
      product_name,
       email,
      product_price,
      product_quantity,
      product_desc,
      product_category,


    } = req.body
    const product = await Product.findOneAndUpdate({ _id: req.params.product_id }, {
      product_name: product_name,
      product_price: product_price,
      product_quantity: product_quantity,
      product_desc: product_desc,
      product_category: product_category,
      img_url_1: results[0].secure_url,

    }
      , {
        new: true,
        runValidators: true
      })
    if (!product) {
      return next(createCustomError(`Product Not found`, 404))
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
      subject: 'Product Status Update',
      html: `
   
    <div style="text-align:left; min-height:60vh; padding:20px">
    
     <h2> Your Producte Update <br/></h2>
     <p>Product Name: ${product_name}</p
     <p>Product Quantity: ${product_quantity}</p>
     <p>Product Unit Price: ${product_price}</p
    </div>
    `
    };
    transporter2.sendMail(mailOptions2, function (error, body) {
      if (error) {
        return res.json({ error: error })
      }

      res.status(StatusCodes.CREATED).json({ msg: "Product Updated", product })
    })


  })
}
//END PRODUCT UPDATE

//DELETE BUSINESS
const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.product_id })
  res.status(StatusCodes.OK).json({ product })
}
/// END DELETTE BUSINESS


module.exports = {
  getProducts,
  getBusinessProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct

}
