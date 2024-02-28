import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const VoucherCode = sequelize.define('VoucherCode',{
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true
    },
    voucherCode : {
        type : DataTypes.STRING,
        allowNull : false
    },
    expiryDate : {
        type : DataTypes.DATE,
        allowNull : false
    },
    isSingleUse : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    },
    totalUses : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})

export default VoucherCode;