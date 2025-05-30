import express from "express";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/noteController.js";
import { authMiddleware } from "../middlewares/middlewares.js";

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authMiddleware);

// Routes cơ bản cho notes
router.get("/", getAllNotes);      // Lấy tất cả ghi chú
router.post("/", createNote);      // Tạo ghi chú mới
router.put("/:id", updateNote);    // Cập nhật ghi chú
router.delete("/:id", deleteNote); // Xóa ghi chú

export default router;
