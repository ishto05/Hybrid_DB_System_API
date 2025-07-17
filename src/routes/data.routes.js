import { Router } from "express";
import authGuard from "../middleware/authguard.middleware.js";
import { uploadData, getData } from "../controllers/data.controller.js";

const testRouter = Router();

testRouter.post("/uploadData", authGuard, uploadData);
testRouter.get("/getData", authGuard, getData);

export default testRouter;
