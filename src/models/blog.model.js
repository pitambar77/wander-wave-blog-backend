import mongoose, { Schema } from 'mongoose'


const blogSchema = new Schema(
    {
        title:{
            type:String,
            required:true,

        },
        description:{
            type:String,
            required:true
        },
        content:{
            type:Object,
            required:true
        },
        coverImage:{
            type:String,
            
        },
        catagory:{
            type:String
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        rating:{
            type:Number
        },   
    },{
        timestamps:true
    }
)



export const Blog = mongoose.model("Blog", blogSchema )