import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.get("/", userController.getUsers);
router.delete("/:id", userController.deleteUser);

export default router;
