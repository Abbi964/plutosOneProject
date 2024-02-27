import bcrypt from 'bcrypt'
import User from '../model/user.js';
import sequelize from '../util/database.js';
import JWT from 'jsonwebtoken'

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