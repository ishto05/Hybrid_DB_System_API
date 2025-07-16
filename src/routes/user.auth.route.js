import { Router } from "express";
import registerUser from "../controllers/user.controller.js";

const userAuthRoute = Router();

userAuthRoute.post("/register", registerUser);

export default userAuthRoute;