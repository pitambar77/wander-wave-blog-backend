import { Router } from 'express'
import { User } from "../models/user.model.js";
import generateToken from '../middleware/generateToken.js';



const router = Router();


// register a new user

router.post('/register', async(req,res) =>{
    try {

        const {username, email, password} = req.body

        const user = new User({username, email, password});

        await user.save();

        res.status(200).send({
            message:"user registered successfully !",
            user:user
        })

        
    } catch (error) {
        console.error("Faield to register:", error);
        res.status(500).json({
            message:"Registration faild !!"
        })
    }
})

// login a user

router.post('/login', async(req,res) =>{
    try {

        const {email,password} = req.body;

        const user = await User.findOne({email});
        
        if(!user){
            return res.status(404).send({
                message:"User not found"
            })
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).send({
                message:"Invalid credential"
            })
        }

        //  generate token here
        
        const token = await generateToken(user._id);

        res.cookie("token",token,{
            httpOnly:true, // enable this only when you have https://
            secure:true,
            sameSite:true
        })

        // console.log(token)

        return res.status(200).send({
            message:"user logged In successfully !",
            token,
            user:{
                _id: user._id,
                email:user.email,
                username:user.username,
                role:user.role
            }
        })
    

        
    } catch (error) {
        console.error("Faield to login:", error);
        res.status(500).json({
            message:"login faild !!"
        })
    }
})

// logout a user

router.post('/logout', async(req,res) =>{
    try {

        res.clearCookie('token');

        res.status(200).send({
            message:"Logout successfully"
        })
        
    } catch (error) {
        console.error("Faield to logout:", error);
        res.status(500).json({
            message:"logout faild !!"
        })
    }
})


// get users

router.get('/users', async (req,res) =>{
    try {

        const user = await User.find({},'id email role');

        res.status(200).send({
            message:"get all user data successfully ",
            user:user
        })
        
    } catch (error) {
        console.error("Error fetching user :", error);
        res.status(500).json({
            message:"Error fetching user"
        })
    }
})

// delete a user

router.delete('/users/:id', async (req,res) =>{
    try {

        const {id} = req.params;

        const user = await User.findByIdAndDelete(id);

        if(!user){
            return res.status(404).send({
                message:"User not found"
            })
        }

        res.status(200).send({
            message:" user deleted successfully ",
            
        })
        
    } catch (error) {
        console.error("Error deletng user :", error);
        res.status(500).json({
            message:"Error deletng user"
        })
    }
})


router.patch('/users/:id', async(req,res) =>{
    try {

        const {id} = req.params;

        const {role} = req.body;

        const user = await User.findByIdAndUpdate(id,{role},{new:true});

        if(!user){
            return res.status(404).send({
                message:"User not found"
            })
        }

        res.status(200).send({
            message:"User role updated successfully!",
            user
        })
        
    } catch (error) {
        console.error("Error while updating  user role:",error);
        res.status(500).send({
            message:" Error while updating user role"
        })

    }
})

export default router