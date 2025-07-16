import { Router } from "express";
import authGuard from "../middleware/authguard.middleware.js";
import uploadData from "../controllers/data.controller.js";

const testRouter = Router()

testRouter.post('/uploadData', authGuard, uploadData);

export default testRouter;