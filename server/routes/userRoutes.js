import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.get("/", userController.getUsers);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.editUser);
router.post("/add", userController.addUser);
// router.get("/history/:id", userController.getUserHistory);
export default router;
