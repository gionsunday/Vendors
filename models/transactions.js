const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({

    email: {
        type: String,
        trim: true
    },
    business_id:{

        type: String,
        trim: true
    },
    product_sold_name: {
        type: String,
        trim: true
    },
    quantity_sold: {
        type: Number,
        trim: true,
        maxlength: [20, "name must not be greater than 20 characters"]
    },
    product_unit_price: {

        type: Number,
        trim: true,
        maxlength: [20, "name must not be greater than 20 characters"]
    },
    product_status: {
        type: String,
        enum: ['Pending', 'Sold', 'Cancelled'],
        default: 'Pending'
    },

    date_sold: {
        type: Date,
        default: Date.now
    },
 

    costumer_name: {
        type: String,
        default: 'Anonymous'
    }



}, { timestamps: true })
module.exports = mongoose.model('Transaction', TransactionSchema)