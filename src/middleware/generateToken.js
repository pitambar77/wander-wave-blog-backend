import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = async (userId) =>{
    try {
        
        const user = await User.findById(userId);

        if(!user){
            throw new Error("User not found!!");
        }

        const token = jwt.sign({userId:user._id, role:user.role},JWT_SECRET,{expiresIn:'1d'})

        return token;

    } catch (error) {
        console.error("Error genrating token :",error);
        throw error
    }
}

export default generateToken;