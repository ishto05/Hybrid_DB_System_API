import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const authGuard = (req, res, next) => {
  try {
    //getiing token form the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "unauthorized",
        message: "Access token missing.",
      });
    }

    //separating token from bearer
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // continue process
    next();
  } catch (error) {
    console.error("AuthGuard Error:", error);
    return res.status(401).json({
      status: "unauthorized",
      message: "Invalid or expired token.",
    });
  }
};

export default authGuard;
