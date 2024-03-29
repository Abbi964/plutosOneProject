import express from 'express'
import { createUser, deleteUser, getAllUsers, getUser, postLogin, updateUser } from '../controller/userController.js';
import verifyToken from '../middleware/verifyToken.js';
const userRouter = express.Router()

// GET user
userRouter.get('/get/:userId',verifyToken,getUser)

// GET All users
userRouter.get('/getAll',verifyToken,getAllUsers)

// POST Create user
userRouter.post('/create',createUser)

// POST Login
userRouter.post('/login',postLogin)

// PUT Update user
userRouter.put('/update/:userId',verifyToken,updateUser)

// DELETE user
userRouter.delete('/delete/:userId',verifyToken,deleteUser)

export default userRouter;