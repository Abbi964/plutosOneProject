import sequelize from "../util/database.js";
import Voucher from "../model/voucher.js";
import { v4 as uuidv4 } from 'uuid';

export const createVoucher = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        let voucherObj = req.body;
        let user = req.user;
        // checking if user is admin
        if(user.isAdmin){
            // create a new voucher
            let voucher = await Voucher.create({
                id  : uuidv4(),
                ...voucherObj
            })
            await t.commit()
            if(voucher){
                res.status(201).json({success : true,voucher })
            }
            else{
                res.status(500).json({msg : "Something went wrong"})
            }
        }
        else{
            res.status(401).json({msg : "You are not an Admin"})
        }

    }
    catch(err){
        console.log(err);
        await t.rollback()
        res.status(500).json({msg : "Something went wrong"})
    }
}