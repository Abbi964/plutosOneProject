// configuring dotenv
import 'dotenv/config'

import express from "express";
import sequelize from './util/database.js';
import bodyParser from 'body-parser';

const app = express()

app.use(bodyParser.json())

// importing routes
import userRouter from './routes/userRoutes.js';

// using routes
app.use('/user',userRouter)

sequelize.sync()
    .then(()=>{
        app.listen(3000,()=>{
            console.log('server running on port 3000')
        })
    })
    .catch(err=>console.log(err))

