import sequelize from "../util/database.js";
import Voucher from "../model/voucher.js";
import { v4 as uuidv4 } from 'uuid';

export const getVoucher = async(req,res)=>{
    try{
        const user = req.user;
        const voucherId = req.params.voucherId;

        if(user.isAdmin){
            // getting voucher
            let voucher = await Voucher.findByPk(voucherId);

            if(voucher){
                res.status(200).json({voucher})
            }
            else{
                res.status(404).json({msg : "voucher not found"})
            }
        }
        else{
            res.status(401).json({msg : "You are not admin"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "Something went wrong"})
    }
}

export const getAllVoucher = async(req,res)=>{
    try{
        const user = req.user;

        if(user.isAdmin){
            // getting all vouchers
            let vouchers = await Voucher.findAll();

            if(vouchers){
                res.status(200).json({vouchers})
            }
            else{
                res.status(404).json({msg : "Something went wrong"})
            }
        }
        else{
            res.status(401).json({msg : "You are not admin"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "Something went wrong"})
    }
}

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
            },{transaction : t})
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


export const updateVoucher = async(req,res)=>{
    try{
        let voucherObj = req.body;
        let user = req.user;
        let voucherId = req.params.voucherId;

        // checking if user is admin
        if(user.isAdmin){
            // finding the voucher
            let voucher = await Voucher.findByPk(voucherId);

            if(voucher){
                // updating the voucher
                await voucher.update(voucherObj)
                await voucher.save()

                await t.commit()
                res.status(200).json({success : true,voucher})
            }
            else{
                res.status(404).json({msg : "voucher with this id does not exist"})
            }
        }
        else{
            res.status(401).json({msg : "You are not an Admin"})
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "Something went wrong"})
    }
} 


export const deleteVoucher = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        let user = req.user;
        let voucherId = req.params.voucherId;

        // checking if user is admin
        if(user.isAdmin){
            // finding the voucher
            let voucher = await Voucher.findByPk(voucherId,{transaction : t});

            if(voucher){
                // deleting the voucher
                await voucher.destroy({transaction : t})

                await t.commit()
                res.status(200).json({success : true})
            }
            else{
                res.status(404).json({msg : "voucher with this id does not exist"})
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