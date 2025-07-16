import { DataTypes } from "sequelize";
import  sequelize  from "../../database/sqldb.config.js"

const record = sequelize.define('Record', {
    title: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
},{
    timestamps: true,
})

export default record;