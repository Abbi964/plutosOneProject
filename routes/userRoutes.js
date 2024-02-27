import express from 'express'
import { createUser, postLogin } from '../controller/userController.js';
const userRouter = express.Router()

// POST Create user
userRouter.post('/create',createUser)

// POST Login
userRouter.post('/login',postLogin)

export default userRouter;