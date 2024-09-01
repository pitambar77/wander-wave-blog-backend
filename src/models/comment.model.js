import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    comment:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        required:true
    }
},{timestamps:true})


export const Comment = mongoose.model("Comment",commentSchema);