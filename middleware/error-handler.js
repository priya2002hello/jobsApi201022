// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    //set default error msg and status code
    statusCode:err.statusCode||StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message||'Something went wrong try again later'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  //check mongoose validation error
  if(err.name=='ValidationError'){
    customError.statusCode=400;
    customError.msg=Object.values(err.errors).map((item)=>{
     return item.message
    }).join(',');
  }

  //check duplicate field error
 if(err.code && err.code==11000)
  {
    customError.msg=`Duplicate value entered for ${Object.keys(err.keyValue)} field ,please choose another value`
    customError.statusCode=400;
  }
 
  //  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
