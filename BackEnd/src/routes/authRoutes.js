import express from "express";
import { register, login, getProfile, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/middlewares.js";

const router = express.Router();

// Routes không cần authentication
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Routes cần authentication
router.get("/profile", authMiddleware, getProfile);

export default router;
