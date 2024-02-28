import express from 'express'
import { createVoucher } from '../controller/voucherController.js';
import verifyToken from '../middleware/verifyToken.js';

const voucherRouter = express.Router();

// POST ctrate voucher
voucherRouter.post('/create',verifyToken,createVoucher)

export default voucherRouter;