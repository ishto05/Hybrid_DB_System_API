import { Sequelize } from "sequelize";
import { SQL } from "../config/env.js";

const sequelize = new Sequelize(SQL.DATABASE_SQL, SQL.USER_SQL, SQL.PASSWD_SQL, {
  host: SQL.HOST_SQL,
  dialect: "mysql",
});

sequelize.authenticate()
console.log("--------------------------------------------------\n")
  .then(() => console.log("✅ MySQL connected.."))
  console.log("--------------------------------------------------\n")
  .catch((err) => console.log("❌ MySQL err: ", err));
console.log("--------------------------------------------------\n")
export default sequelize;
