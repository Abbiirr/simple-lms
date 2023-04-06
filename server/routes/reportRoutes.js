import express from "express";
import reportController from "../controllers/reportController.js";

const router = express.Router();

router.get("/borrowed", reportController.getAllBorrowedBooks);
router.get("/available", reportController.getAllAvailableBooks);
router.get("/overdue", reportController.getOverdueBooks);

export default router;
