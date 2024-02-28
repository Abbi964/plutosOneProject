import express from 'express'
import verifyToken from '../middleware/verifyToken.js';
import { createVoucherCode, deleteVoucherCode, getAllVoucherCodes, getVoucherCode, updateVoucherCode } from '../controller/voucherCodeController.js';

const voucherCodeRoute = express.Router();

// GET all voucher codes
voucherCodeRoute.get('/getAll',verifyToken,getAllVoucherCodes)

// GET  voucherCode
voucherCodeRoute.get('/get/:voucherCodeId',verifyToken,getVoucherCode)

// POST create voucherCode
voucherCodeRoute.post('/create',verifyToken,createVoucherCode)

// PUT update voucherCode
voucherCodeRoute.put('/update/:voucherCodeId',verifyToken,updateVoucherCode)

// DELETE voucherCode
voucherCodeRoute.delete('/delete/:voucherCodeId',verifyToken,deleteVoucherCode)

export default voucherCodeRoute;