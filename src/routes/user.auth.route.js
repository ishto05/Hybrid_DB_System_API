import { Router } from "express";
import { registerUser, userLogin } from "../controllers/user.controller.js";

const userAuthRoute = Router();

userAuthRoute.post("/register", registerUser);
userAuthRoute.post("/login", userLogin);

export default userAuthRoute;
