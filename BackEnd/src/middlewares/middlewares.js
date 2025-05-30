import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware xác thực token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Không có token, truy cập bị từ chối" 
    });
  }

  // Kiểm tra format Bearer token
  const newToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token;

  try {
    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin user vào request (có id và username)
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ 
      success: false,
      message: "Token không hợp lệ" 
    });
  }
};

// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi server",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware log request
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

export { authMiddleware, errorHandler, requestLogger };
export default authMiddleware;