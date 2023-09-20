const { BadRequestError } = require("../errors/errorsIndex")
require('dotenv').config()
const nodemailer = require('nodemailer')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const Transaction = require('../models/transactions')


//GET ALL TRANSACTION
const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find({ business_id:req.body.business_id }).sort()
  res.status(StatusCodes.OK).json({ transactions, count: transactions.length })
}
//END GET ALL TRANSACTION

///GET SINGLE TRANSACTION
const getSingleTransaction = async (req, res) => {
  const transaction = await Transaction.find({ _id: req.body.transaction_id })
  res.status(StatusCodes.OK).json({ transaction, })
}
//END GET SINGLE TRANSACTION

//CREATE TRANSACTION
const createTransaction = async (req, res) => {
  const transaction = await Transaction.create(req.body)
  const { email, product_sold_name,
    quantity_sold,
    product_unit_price,
    product_status, date_sold,
    customer_name } = req.body
  res.status(StatusCodes.CREATED).json({ transaction })

  var transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'richardadaji@gmail.com',
      pass: 'bgmmsxicwlihpzro'
    }
  })
  const mailOptions2 = {
    from: 'richardadaji@gmail.com',
    to: email,
    subject: 'New Sale Alert',
    html: `
  <div style="text-align:left; min-height:60vh; padding:20px">
   <h2>Product Name: ${product_sold_name} <br/></h2>
   <h2>Product Unit: ${product_unit_price} <br/></h2>
   <h2>Quantity Sold: ${quantity_sold} <br/></h2>
   <h2>Customer: ${customer_name} <br/></h2>
   
   <p>Login to see more details</p>
   </div>
  `
  };
  transporter2.sendMail(mailOptions2, function (error, body) {
    if (error) {
      return res.json({ error: error })
    }
    res.status(StatusCodes.CREATED).json({ transaction })
  })

}
//END CREATE TRANSACTION

///Update Transaction
const updateTransaction = async (req, res) => {
  const {
    email,
    product_sold_name,
    quantity_sold,
    product_unit_price,
    product_status,
    date_sold,
    customer_name
  } = req.body
  const transaction = await Transaction.findOneAndUpdate({ _id: req.params.transaction_id }, {

    product_sold_name: product_sold_name,
    quantity_sold: quantity_sold,
    product_unit_price: product_unit_price,
    product_status: product_status,

    customer_name: customer_name

  }, {
    new: true,
    runValidators: true
  })
  res.status(StatusCodes.CREATED).json({ transaction })

}

// END TRANSACTION UPDATE

//DELET A TRANSACTION
const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.transaction_id })
  res.status(StatusCodes.OK).json({ transaction, })
}
//END DELETE


module.exports = {
  getAllTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction


}
