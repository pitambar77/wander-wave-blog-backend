import { Router } from 'express'
import { Comment } from '../models/comment.model.js';

const router = Router();

// create a comment

router.post('/post-comment', async (req,res) =>{
    
    try {
        const newComment = new Comment (req.body);
        await newComment.save();
        
        res.status(200).send({
            message:"Comment created successfully ",
            comment:newComment
        })
    } catch (error) {
        console.error("An error occured when create comment :", error);
        res.status(500).send({
            message:"An error occured when create comment :"
        })
    }
})

// get all comments count

router.get('/total-comments', async (req,res) =>{
    try {
        
        const totalComment = await Comment.countDocuments({});

        res.status(200).send({
            message:"Total comment count",
            comment:totalComment
        })

    } catch (error) {
        console.error("An error occured when count comments :", error);
        res.status(500).send({
            message:"An error occured when count comments :"
        })
    }
})



export default router