const mongoose= require('mongoose');
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken');
require('dotenv')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Provide name'],
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        required:[true,'Please Provide email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please Provide Password'],
        minlength:6,
      
    },
})

//middleware , hashes the password and then saves in database
UserSchema.pre('save',async function (next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next()
})

UserSchema.methods.getName=function(){
    return this.name;
}

UserSchema.methods.getToken=function(){
return jwt.sign(
    {
    userId:this._id,
    name:this.name
    },
    process.env.JWT_SECRET,
    {
    expiresIn:process.env.JWT_LIFETIME
    });
}

UserSchema.methods.checkPassword=async function(candidatePassword){
        const isMatch=await bcrypt.compare(candidatePassword,this.password)
        return isMatch;
}
module.exports=mongoose.model('User',UserSchema)