import express from 'express'
import { claimVoucher, createVoucher, deleteVoucher, getAllVoucher, getVoucher, updateVoucher } from '../controller/voucherController.js';
import verifyToken from '../middleware/verifyToken.js';

const voucherRouter = express.Router();

// GET voucher
voucherRouter.get('/get/:voucherId',verifyToken,getVoucher)

// GET All voucher
voucherRouter.get('/getAll',verifyToken,getAllVoucher)

// POST ctrate voucher
voucherRouter.post('/create',verifyToken,createVoucher)

// PUT update voucher
voucherRouter.put('/update/:voucherId',verifyToken,updateVoucher)

// DELETE delete voucher
voucherRouter.delete('/delete/:voucherId',verifyToken,deleteVoucher)

// GET claimVoucher
voucherRouter.get('/claim/:voucherId',verifyToken,claimVoucher)

export default voucherRouter;