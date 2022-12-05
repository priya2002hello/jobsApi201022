const User=require('../models/User');
const {StatusCodes}=require('http-status-codes')
const {BadRequestError,UnauthenticatedError}=require('../errors/index')
const jwt=require('jsonwebtoken')

const register=async(req,res)=>{

    //... -> spread operator, All the properties of req.body object are overwritten to other object
    const user=await User.create({...req.body});
   
    res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token:user.getToken()});
}

const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password)
    {
        throw new BadRequestError("Please provide email and password");
    }

    const user =await User.findOne({email});
   

    if(!user)
    {
        throw new UnauthenticatedError("Invalid Credentials");
    }

     //compare password
    const isPasswordCorrect=await user.checkPassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Credentials");
    }
    
    const token=user.getToken();
    res.status(StatusCodes.OK).json({user:{name:user.getName()},token});
}

module.exports={
    register,login
}