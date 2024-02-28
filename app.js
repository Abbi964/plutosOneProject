// configuring dotenv
import 'dotenv/config'

import express from "express";
import sequelize from './util/database.js';
import bodyParser from 'body-parser';

// importing models
import User from './model/user.js';
import Voucher from './model/voucher.js';
import VoucherCode from './model/voucherCode.js';
import UserVoucherCode from './model/user_voucherCode.js';

const app = express()

app.use(bodyParser.json())

// importing routes
import userRouter from './routes/userRoutes.js';
import voucherRouter from './routes/voucherRoutes.js';
import voucherCodeRouter from './routes/voucherCodeRoutes.js';

// using routes
app.use('/user',userRouter)
app.use('/voucher',voucherRouter)
app.use('/voucherCode',voucherCodeRouter)

// defining relations between models
Voucher.hasMany(VoucherCode)
VoucherCode.belongsTo(Voucher)

User.belongsToMany(VoucherCode,{through : UserVoucherCode, foreignKey : 'userId'})
VoucherCode.belongsToMany(User,{through : UserVoucherCode, foreignKey : 'voucherCodeId'})

sequelize.sync()
    .then(()=>{
        app.listen(3000,()=>{
            console.log('server running on port 3000')
        })
    })
    .catch(err=>console.log(err))

