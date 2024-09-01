import { Router } from 'express'
import { Blog } from '../models/blog.model.js';
import { Comment } from '../models/comment.model.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';


const router = Router();

// create a blog

router.post('/create-post', verifyToken, isAdmin, async (req,res)=>{
    try {

        const newPost = new Blog({...req.body, author:req.userId}); // use auther: req.userId when you have tokenverification
        await newPost.save();
        res.status(201).send({
            message:"create blogs successfully",
            posts:newPost
        })
        
        
    } catch (error) {
        console.error("Error creation post : ", error);
        res.status(500).send({message:"Error creation post!"})
    }
})

// get all blogs

router.get('/', async (req,res) =>{
    try {
        // search function

        const {search, catagory } = req.query;
        console.log(search);

        let query = {}

        if(search){
            query = {
                ...query,
                $or:[
                    {title:{$regex:search, $options:"i"}},
                    {content:{$regex:search, $options:"i"}}
                ]
            }
        }

        if(catagory){
            query = {
                ... query,
                catagory:catagory
            }
        }

        const posts = await Blog.find(query).populate('author','email username').sort({createdAt:-1}); // new post show on top and old post in last
        res.status(200).send(posts)
        // console.log(posts);
    } catch (error) {
        console.error("Error getting post : ", error);
        res.status(500).send({message:"Error getting post!"})
    }
})

// get a blog by id

router.get('/:id', async (req,res) =>{
    try {
        const postId = req.params.id
        const post = await Blog.findById(postId).populate('author', 'email username');

        if(!post){
            return res.status(404).send({
                message:"Post not found"
            })
        }

        // with also fetch comment related to the post

        const comments = await Comment.find({postId:postId}).populate('user' , 'username email')

        res.status(200).send({
            post,comments
        })
        
        // console.log(post);

    } catch (error) {
       console.error("Error fetching at single post :",error);
       res.status(500).send({
        message:"Error fecting on single  post"
       }) 
    }
})

//update a blog 

router.patch('/update-post/:id', verifyToken, isAdmin, async (req,res) =>{
    try { 
        
        const postId = req.params.id;

        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        },{new:true})

        if(!updatedPost){
            return res.status(400).send({
                message:"Post not found"
            })
        }
        res.status(200).send({
            message:" Post updated successfully ...",
            post:updatedPost
        })

    } catch (error) {
        console.error("Error updating post :",error);
        res.status(500).send({
        message:"Error updating"
       }) 
    }
})

// delete a blog post

router.delete("/:id", verifyToken, isAdmin, async (req,res) =>{
    try {

        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);

        if(!post){
            return res.status(400).send({message:"Post not found"})
        }

        // delete related comment

        await Comment.deleteMany({postId:postId})

        res.status(200).send({
            message:"Post deleted successfully ",
            
        })
        
    } catch (error) {
        console.error("Error deleting post:",error);
        res.status(500).send({message:"Error deleting post"})
    }
})

// related blog

router.get("/related/:id", async (req,res) =>{
    try {

        const {id} = req.params;

        if(!id){
            return res.status(400).send({
                message:"Post is required"
            })
        }

        const blog = await Blog.findById(id);

        if(!blog){
            return res.status(400).send({
                message:"Post is not found"
            })
        }
        

        // based on title

        // const titleRegex = new RegExp(blog.title.split(' ').join('|'),'i');

        // const relatedQuery = {
        //     _id:{$ne:id}, // exclude the current blog by id
        //     title:{$regex:titleRegex}
        // }

        // Based on Catagory

        const catagoryRegex = new RegExp(blog.catagory.split(' ').join('|'),'i');

        const relatedQuery = {
            _id:{$ne:id}, // exclude the current blog by id
            catagory:{$regex:catagoryRegex}
        }

        const relatedPost = await Blog.find(relatedQuery);
        res.status(200).send(relatedPost);

        
    } catch (error) {
        console.error("Error fetching related post:",error);
        res.status(500).send({message:"Error fetching related post"})
    }
})


export default router