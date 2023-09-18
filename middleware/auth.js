const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { unAuthenticatedError} = require('../errors/errorsIndex')

const auth = async (req, res, next) =>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new unAuthenticatedError('Authentication Error! Not Authorized')
    }
    const token = authHeader.split(' ')[1]
  console.log(authHeader)
  console.log(token)
    try {
        const payload = jwt.verify(token,  process.env.JWT_SECRETE)
        req.user =  {userID:payload.userID, name:payload.name}
        next()
    } catch (error) {
        throw new unAuthenticatedError('Authentication Error! Absolute error!')
    
    }
}

module.exports = auth