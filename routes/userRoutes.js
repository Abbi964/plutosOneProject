import express from 'express'
import { createUser, deleteUser, postLogin, updateUser } from '../controller/userController.js';
import verifyToken from '../middleware/verifyToken.js';
const userRouter = express.Router()

// POST Create user
userRouter.post('/create',createUser)

// POST Login
userRouter.post('/login',postLogin)

// PUT Update user
userRouter.put('/update',verifyToken,updateUser)

// DELETE user
userRouter.delete('/delete/:userId',verifyToken,deleteUser)

export default userRouter;