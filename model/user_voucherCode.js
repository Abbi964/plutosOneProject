import {  DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const UserVoucherCode = sequelize.define('UserVoucherCode',{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    }
})

export default UserVoucherCode;