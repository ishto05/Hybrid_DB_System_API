import jwt from "jsonwebtoken";
import sequelize from "../database/sqldb.config.js";
import User from "../models/sql/sql.user.js";
import bcrypt from "bcryptjs";
import { JWT_EXPIRY, JWT_SECRET } from "../config/env.js";

export const registerUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password, name } = req.body;

    //checking if the user already exists
    const existinguser = await User.findOne({ where: { email }, transaction });

    if (existinguser) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Email is already registerd!",
      });
    }

    //hasing password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      {
        email,
        passwordHash,
        name,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      status: "sucess",
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log("Error registering User", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error. Failed to register User!",
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Can't find user | Invalid email or password!",
      });
    }

    const decryptPassword = await bcrypt.compare(password, user.passwordHash);
    if (!decryptPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    //generating JWT

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
    return res.status(200).json({
      status: "success",
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during login.',
    });
  }
};
