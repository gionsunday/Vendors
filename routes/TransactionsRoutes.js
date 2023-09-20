const express = require('express')
const router = express.Router()

const {
    getAllTransactions,
    getSingleTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
    
} = require('../controllers/transactions')

router.route('/create').post(createTransaction)
router.get('/getall/:business_id', getAllTransaction)
router.get('/getsingle/:transaction_id', getSingleTransaction)
router.post('/update/:transaction_id', updateTransaction)
router.post('/delete/:transaction_id', deleteTransaction)

module.exports = router
