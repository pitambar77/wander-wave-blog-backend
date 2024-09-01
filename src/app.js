import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.json({limit:'10mb'}));

app.use(bodyParser.urlencoded({limit:"10mb" ,extended:true}));

// routes

import blogRouter from './routes/blog.route.js'
import commentRouter from './routes/comment.route.js'
import userRouter from './routes/auth.user.route.js'
import bodyParser from 'body-parser'

app.use("/api/auth",userRouter);

app.use("/api/blogs", blogRouter)

app.use("/api/comments",commentRouter);



export {app}