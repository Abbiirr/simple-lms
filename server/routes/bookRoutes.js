import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.getBooks);

router.post("/insert", bookController.addBook);

router.get("/search", bookController.searchBooks);

export default router;
