const CustomAPIError = require("./custom-errors")
const {StatusCodes} = require('http-status-codes')

class unAuthenticatedError extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = unAuthenticatedError