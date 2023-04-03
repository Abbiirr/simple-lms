import express from "express";
import authController from "../controllers/authController.js";
const router = express.Router();

router.post("/register", authController.Register);
router.post("/login", authController.Login);
router.post("/reset", authController.Reset);
router.get("/logout", authController.Logout);
//router.get('/:id/verify/:token/', AuthController.verifyToken)

export default router;
