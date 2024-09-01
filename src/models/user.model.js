import mongoose, { Schema } from 'mongoose'
import bycrypt from 'bcryptjs'

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:'user'
        }

    },{timestamps:true}
)

// hash password before saving to database

userSchema.pre('save', async function (next) {
    const user = this;
    if(!user.isModified('password')) return next();

    const hashedPassword = await bycrypt.hash(user.password, 10);

    user.password = hashedPassword;
    next();

})

//compare password when tries to login


userSchema.methods.comparePassword = function (givenPasssword){
    return bycrypt.compare(givenPasssword, this.password);
}



export const User = mongoose.model("User", userSchema); 