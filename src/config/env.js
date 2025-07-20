import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,

  JWT_SECRET,
  JWT_EXPIRY,
  RABBITMQ_URL,
  RABBITMQ_EXCHANGE,
} = process.env;

export const SQL = {
  HOST_SQL: process.env.HOST_SQL,
  USER_SQL: process.env.USER_SQL,
  PASSWD_SQL: process.env.PASSWD_SQL,
  DATABASE_SQL: process.env.DATABASE_SQL,
};
