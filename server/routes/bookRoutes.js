import express from "express";

import asyncHandler from "express-async-handler";

import { connectDB, db } from "../config/db.js";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.getBooks);

router.post("/insert", bookController.addBook);

router.get("/search", bookController.searchBooks);

// router.get("/borrow", (req, res) => {
//   const { query } = req.query;

export default router;
