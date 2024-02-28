import { v4 as uuidv4 } from "uuid";
import VoucherCode from "../model/voucherCode.js";
import sequelize from "../util/database.js";


export const createVoucherCode = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        // getting user obj from req
        const voucherCodeObj = req.body;
        const user = req.user;

        if (user.isAdmin){
            // creating new voucher code
            let voucherCode = await VoucherCode.create({
                id : uuidv4(),
                ...voucherCodeObj
            },{transaction : t})
            
            await t.commit()
            if(voucherCode){
                res.status(201).json({success : true, voucherCode})
            }
            else{
                res.status(500).json({msg : "something went wrong"})
            }
        }
    }
    catch(err){
        console.log(err);
        await t.rollback()
        res.status(500).json({msg : "something went wrong"})
    }
}


export const getAllVoucherCodes = async(req,res)=>{
    try{
        const user = req.user;

        if (user.isAdmin){
            // getting all voucher codes
            let voucherCodes = await VoucherCode.findAll();
    
            if (voucherCodes){
                res.status(200).json({voucherCodes})
            }
            else{
                res.status(500).json({msg : 'Something went wrong'})
            }
        }
        else{
            res.status(401).json({msg : 'You are not admin'})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "something went wrong"})
    }
}

export const getVoucherCode = async(req,res)=>{
    try{
        const user = req.user;
        const voucherCodeId = req.params.voucherCodeId

        if (user.isAdmin){
            // getting voucher code
            let voucherCode = await VoucherCode.findByPk(voucherCodeId);
    
            if (voucherCode){
                res.status(200).json({voucherCode})
            }
            else{
                res.status(500).json({msg : 'voucherCode with this id does not exist'})
            }
        }
        else{
            res.status(401).json({msg : 'You are not admin'})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg : "something went wrong"})
    }
}


export const updateVoucherCode = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        let voucherCodeObj = req.body;
        let user = req.user;
        let voucherCodeId = req.params.voucherCodeId;

        // checking if user is admin
        if(user.isAdmin){
            // finding the voucher
            let voucherCode = await VoucherCode.findByPk(voucherCodeId);

            if(voucherCode){
                // updating the voucherCode
                await voucherCode.update(voucherCodeObj)
                await voucherCode.save({transaction : t})

                await t.commit()
                res.status(200).json({success : true,voucherCode})
            }
            else{
                res.status(404).json({msg : "voucherCode with this id does not exist"})
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


export const deleteVoucherCode = async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        let user = req.user;
        let voucherCodeId = req.params.voucherCodeId;

        // checking if user is admin
        if(user.isAdmin){
            // finding the voucherCode
            let voucherCode = await VoucherCode.findByPk(voucherCodeId,{transaction : t});

            if(voucherCode){
                // deleting the voucherCode
                await voucherCode.destroy({transaction : t})

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
