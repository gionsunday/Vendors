const express = require("express")
const router = express.Router()

const initializePayment = require("../controllers/paysack")

router.post('/acceptpayment', initializePayment.acceptPayment)

module.exports = router