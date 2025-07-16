import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../database/sqldb.config.js";

const generateUserId = () => `USR_${uuidv4()}`;

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    defaultValue: generateUserId,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
    timestamps: true,
    tableName: 'users'
});

export default User;
