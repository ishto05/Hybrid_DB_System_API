import sequelize from "../database/sqldb.config.js";
import User from "../models/sql/sql.user.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
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

export default registerUser;
