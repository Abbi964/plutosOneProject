import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const Voucher = sequelize.define('Voucher',{
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true
    },
    brandName : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    brandInfo : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    voucherName : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    voucherDetails : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    price : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})

export default Voucher;