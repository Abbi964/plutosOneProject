import sequelize from "../util/database.js";
import Voucher from "../model/voucher.js";
import { v4 as uuidv4 } from "uuid";
import VoucherCode from "../model/voucherCode.js";
import UserVoucherCode from "../model/user_voucherCode.js";
import { Op } from "sequelize";
import csvtojson from "csvtojson";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const getVoucher = async (req, res) => {
  try {
    const user = req.user;
    const voucherId = req.params.voucherId;

    if (user.isAdmin) {
      // getting voucher
      let voucher = await Voucher.findByPk(voucherId);

      if (voucher) {
        res.status(200).json({ voucher });
      } else {
        res.status(404).json({ msg: "voucher not found" });
      }
    } else {
      res.status(401).json({ msg: "You are not admin" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export const getAllVoucher = async (req, res) => {
  try {
    const user = req.user;

    if (user.isAdmin) {
      // getting all vouchers
      let vouchers = await Voucher.findAll();

      if (vouchers) {
        res.status(200).json({ vouchers });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    } else {
      res.status(401).json({ msg: "You are not admin" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export const createVoucher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let voucherObj = req.body;
    let user = req.user;
    // checking if user is admin
    if (user.isAdmin) {
      // create a new voucher
      let voucher = await Voucher.create(
        {
          id: uuidv4(),
          ...voucherObj,
        },
        { transaction: t }
      );
      await t.commit();
      if (voucher) {
        res.status(201).json({ success: true, voucher });
      } else {
        res.status(500).json({ msg: "Something went wrong" });
      }
    } else {
      res.status(401).json({ msg: "You are not an Admin" });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    let voucherObj = req.body;
    let user = req.user;
    let voucherId = req.params.voucherId;

    // checking if user is admin
    if (user.isAdmin) {
      // finding the voucher
      let voucher = await Voucher.findByPk(voucherId);

      if (voucher) {
        // updating the voucher
        await voucher.update(voucherObj);
        await voucher.save();

        await t.commit();
        res.status(200).json({ success: true, voucher });
      } else {
        res.status(404).json({ msg: "voucher with this id does not exist" });
      }
    } else {
      res.status(401).json({ msg: "You are not an Admin" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export const deleteVoucher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let user = req.user;
    let voucherId = req.params.voucherId;

    // checking if user is admin
    if (user.isAdmin) {
      // finding the voucher
      let voucher = await Voucher.findByPk(voucherId, { transaction: t });

      if (voucher) {
        // deleting the voucher
        await voucher.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ msg: "voucher with this id does not exist" });
      }
    } else {
      res.status(401).json({ msg: "You are not an Admin" });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export const claimVoucher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const user = req.user;
    const voucherId = req.params.voucherId;
    console.log("reached");
    // checking if voucher has any avilable voucher codes
    // first getting voucher
    let voucher = await Voucher.findByPk(voucherId, { transaction: t });

    if (voucher) {
      // checking for avilable voucher codes
      let currentDate = new Date();
      let voucherCode = await VoucherCode.findOne({
        where: {
          VoucherId: voucherId,
          isActive: true,
          expiryDate: {
            [Op.gt]: currentDate,
          },
        },
        transaction: t,
      });

      if (voucherCode) {
        // updating voucher code
        if (voucherCode.isSingleUse || voucherCode.totalUses == 1) {
          // deactivating it
          voucherCode.isActive = false;
        } else {
          // decreasing the totaluses
          voucherCode.totalUses -= 1;
        }
        await voucherCode.save({ transaction: t });

        // now updating this info in UserVoucherCode table-----------------//
        let [result, created] = await UserVoucherCode.findOrCreate({
          where: { userId: user.id, voucherCodeId: voucherCode.id },
          defaults: { userId: user.id, voucherCodeId: voucherCode.id },
          transaction: t,
        });

        if (created) {
          await t.commit();
          res.status(200).json({
            msg: `${user.username} has claimed Voucher code ( ${voucherCode.voucherCode} )`,
            brandName: voucher.brandName,
            brandInfo: voucher.brandInfo,
            voucherDetails: voucher.voucherDetails,
            price: voucher.price,
            voucherCode: voucherCode.voucherCode,
            expiryDate: voucherCode.expiryDate,
          });
        } else {
          res
            .status(401)
            .json({ msg: "You have already claimed the voucherCode" });
        }
      } else {
        res.status(404).json({ msg: "No avilable voucher code" });
      }
    } else {
      res.status(404).json({ msg: "wrong voucherId" });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export const uploadVoucherCSV = (req, res) => {
//   const t = await sequelize.transaction();
  try {
    // getting file dueto multer
    const csvFile = req.file;
    const user = req.user;
    const voucherId = req.params.voucherId;
    if (user.isAdmin) {
      // converting csv to json
      let obj;

      csvtojson()
        .fromFile(csvFile.path)
        .then(async(jsonObj) => {
            // creating new coupon codes
            const voucherCodeArr = Array.from(jsonObj);
            let newVoucherCodeArray = []

            for (let data of voucherCodeArr){
                let expDate = new Date(data.expiryDate)
                let newVoucherCode = await VoucherCode.create({
                    id : uuidv4(),
                    VoucherId : voucherId,
                    voucherCode : data.voucherCode,
                    expiryDate : expDate,
                    isSingleUse : data.isSingleUse,
                    totalUses : Number(data.totalUses)
                })
                newVoucherCodeArray.push(newVoucherCode)
            }
            
            
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            // now deleting the csvFile from server
            fs.unlink(path.join(__dirname,'..',csvFile.path),(err)=>{
                if(err){
                    console.log('Some eror occurd during deleting file');
                    res.status(500).json({
                        voucherCodeArray : newVoucherCodeArray,
                        msg : "Some error occurd during deletion of file from server"
                    })
                }
                else{
                    res.status(201).json({success : true,voucherCodeArray : newVoucherCodeArray,})
                }
            })
        })
        .catch((err) => {
          console.error("Error converting CSV to JSON:", err);
        });

    } 
    else {
      res.status(401).json({ msg: "You are not an Admin" });
    }
  } 
  catch (err) {
    console.log(err);
    // await t.rollback();
    res.status(500).json({ msg: "Something went wrong" });
  }
};
