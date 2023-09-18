const mongoose = require('mongoose')

const productImageSchema = new mongoose.Schema({
    name: {
        type:String,
        default: "product"
    },
    description :{
        type:String,
        default: "product picture"

    },
   
    uploadedBy: {

        type:String,
        default: "product picture"
    },
    img_url:{

        type:String,
        default:""
    }
    
})

module.exports = mongoose.model('imgModel', productImageSchema)