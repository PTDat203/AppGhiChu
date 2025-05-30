// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";
import { errorHandler, requestLogger } from "./src/middlewares/middlewares.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routes - Chạy thẳng không qua index.js
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API hoạt động bình thường",
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Chào mừng đến với Note API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      notes: "/api/notes",
      health: "/api/health"
    }
  });
});

// Error handler middleware (phải đặt cuối cùng)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint không tồn tại"
  });
});

const startServer = async () => {
  try {
    await connectDb(process.env.DB_URI);
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📝 API Documentation: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;