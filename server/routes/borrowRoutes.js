import express from "express";
import borrowController from "../controllers/borrowController.js";

const router = express.Router();

router.post("/take", borrowController.borrowBook);

router.post("/return", borrowController.returnBook);

export default router;
