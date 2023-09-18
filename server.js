require('dotenv').config()
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const nodeMailer = require('nodemailer')
const express= require('express')

const path = require('path')
const app = express()

//middleware
const notFoundMiddleware = require('./middleware/notfound')
const errorHandlerMiddleware = require('./middleware/errorHandler')
const authenticateUser =  require('./middleware/auth')
const connectDB = require('./db/dbCon')
 

//import routes
const authRouter =  require('./routes/AuthRoutes')
const imageRouter = require('./routes/ProductImgRoutes')
const businessRouter =  require('./routes/BusinessRoute')
const productRouter =  require('./routes/ProductRoutes')
const paystackRouter = require('./routes/PaystackRoute')
const transactionsRouter =  require('./routes/TransactionsRoutes')

//use routes
app.use('/', express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true, limit:'10mb'}))
app.use(bodyParser.json({limit:'10mb'}))
app.use(cors())
app.use('/vendor/auth', authRouter)
app.use('/vendor/business', businessRouter)
app.use('/vendor/payment', paystackRouter)
app.use('/vendor/product', productRouter)
app.use('/vendor/transaction', transactionsRouter)
app.use('/vendor/avatar', imageRouter)


//errorhandllers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//start server
const port = process.env.PORT || 8000
const start = async () =>{
    await connectDB(process.env.NEW_ACTUAL_STRING)
    try {
        app.listen(port, console.log(`Server is Live at port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start()
