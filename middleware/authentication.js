const User=require('../models/User')
const jwt=require('jsonwebtoken')
const {UnauthenticatedError}=require('../errors/index')

const auth=(req,res,next)=>{
    const autheaders=req.headers.authorization
    if(!autheaders || !autheaders.startsWith('Bearer ')){
        throw new UnauthenticatedError("Authentication invalid");
    }

    const token=autheaders.split(' ')[1];

    try {
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        //attach user to job route
        req.user={userId:payload.userId,name:payload.name};
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports=auth;