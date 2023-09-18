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
router.get('/getall/:business_id').post(getAllTransactions)
router.get('/getsingle/:transaction_id').post(getSingleTransaction)
router.route('/update/:transaction_id').post(updateTransaction)
router.post('/delete/:transaction_id', deleteTransaction)

module.exports = router