import bcrypt from 'bcrypt'
import User from '../model/user.js';
import sequelize from '../util/database.js';
import JWT from 'jsonwebtoken'
import UserVoucherCode from '../model/user_voucherCode.js';

export const getUser = async(req,res)=>{
    try{
        const user = req.user;
        const userId = req.params.userId

        if(user.id == userId || user.isAdmin){
    
            // getting user
            let user = await User.findByPk(userId)

            if(user){
                // also getting vouchercodes claimed by user
                let claimedVoucherCodes = await user.getVoucherCodes({
                    attributes : ['id','voucherCode','VoucherId']
                })    // magic method

                res.status(200).json({user,claimedVoucherCodes}) 
            }
            else{
                res.status(404).json({msg : "user not found"})
            }
    
        }
        else{
            res.status(401).json({msg : "Not Authorized"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "something went wrong"})
    }
}

export const getAllUsers = async(req,res)=>{
    try{
        const user = req.user;

        if(user.isAdmin){
    
            // getting users
            let users = await User.findAll()

            if(users){
                res.status(200).json({users}) 
            }
            else{
                res.status(404).json({msg : "Something went wrong"})
            }
    
        }
        else{
            res.status(401).json({msg : "Not Authorized"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "something went wrong"})
    }
}


export const createUser = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        // getting user obj from req
        const userObj = req.body;
        
        // hasing password
        bcrypt.hash(userObj.password, 10 ,async(err,hash)=>{
            if(err){
                res.status(500).json({msg : "something went wrong"})
            }
            else{
                // finding if user exist already if not then creating new
                let [user, created] = await User.findOrCreate({
                    where : {email : userObj.email},
                    defaults : {
                        username : userObj.username,
                        email : userObj.email,
                        password : hash
                    },
                    transaction : t
                })
                
                await t.commit();
                if (created){
                    res.status(201).json({user})
                }
                else{
                    res.status(409).json({msg : "User already exists"})
                }
            }
        })

    }
    catch(err){
        console.log(err);
        await t.rollback()
        res.status(500).json({msg : "something went wrong"})
    }
}

export const postLogin = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        // geting loginObj from req body
        const loginObj = req.body;

        // checking if user exists
        let user = await User.findOne({
            where : {email : loginObj.email},
            transaction : t
        })

        if (user){
            // comparing password
            bcrypt.compare(loginObj.password,user.password,(err,same)=>{
                if(err){
                    res.status(500).json({msg : "something went wrong"})
                }
                else if(same){
                    // sending an access token
                    let accessToken = JWT.sign({userId:user.id},process.env.JWT_KEY)
                    res.status(200).json({success : true,accessToken})
                }
                else{
                    res.status(401).json({success : false,msg : "Wrong Password"})
                }
            })
        }
        else{
            res.status(401).json({msg : "User does not exist"})
        }
    }
    catch(err){
        console.log(err);
        await t.rollback()
        res.status(500).json({msg : "something went wrong"})
    }
}

export const updateUser = async(req,res)=>{
    try{
        const user = req.user;
        const updateUserObj = req.body;
        const userId = req.params.userId

        if(user.id == userId || user.isAdmin){
            // hasing password
            let hash = bcrypt.hashSync(updateUserObj.password,10)
            updateUserObj.password = hash
    
            // updating user
            await user.update(updateUserObj)
            await user.save()
    
            res.status(201).json({user}) 
        }
        else{
            res.status(401).json({msg : "Not Authorized"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "something went wrong"})
    }
}

export const deleteUser = async(req,res)=>{
    try{
        const user = req.user;
        const userId = req.params.userId;

        if (user.id == userId || user.isAdmin){
            // deleting user
            await user.destroy()

            res.status(200).json({success : true})
        }
        else if(!user.isAdmin){
            res.status(401).json({msg : "Not Authorized : you are not admin"})
        }
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "something went wrong"})
    }
}

