// configuring dotenv
import 'dotenv/config'

import express from "express";
import sequelize from './util/database.js';
import bodyParser from 'body-parser';

const app = express()

app.use(bodyParser.json())

// importing routes
import userRouter from './routes/userRoutes.js';
import voucherRouter from './routes/voucherRoutes.js';

// using routes
app.use('/user',userRouter)
app.use('/voucher',voucherRouter)

sequelize.sync()
    .then(()=>{
        app.listen(3000,()=>{
            console.log('server running on port 3000')
        })
    })
    .catch(err=>console.log(err))

