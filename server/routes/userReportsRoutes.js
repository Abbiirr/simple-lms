import express from "express";
import userReportsController from "../controllers/userReportsController.js";
const router = express.Router();

router.get("/due", userReportsController.getDueBooks);
export default router;
