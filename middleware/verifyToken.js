// this middleware takes token in headers in reqest and send user in req.user to next middleware attached to it 

import User from '../model/user.js';
import jwt from 'jsonwebtoken';

const verifyToken = async(req,res,next)=>{
    try{
        let token = req.headers.authorization
        // getting userId from token
        let data = jwt.verify(token,process.env.JWT_KEY);
        let userId = data.userId;
        // finding user using userId
        let user = await User.findByPk(userId);

        if(!user){
            res.status(401).json({msg : 'Autorization failed'}) 
        }
        else{
            // connecting this middleware to next middleware and also
            // sending user in req to next middleware
            req.user = user;
            next()
        }

    }
    catch(err){
        console.log(err)
        res.status(500).json({msg : 'Something went wrong'})
    }
}

export default verifyToken;