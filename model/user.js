import {  DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const User = sequelize.define('User',{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    username : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    isAdmin : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : false
    }
})

export default User;