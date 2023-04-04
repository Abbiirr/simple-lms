import express from "express";
import borrowController from "../controllers/borrowController.js";

const router = express.Router();

router.post("/take", borrowController.borrowBook);

export default router;
