import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Đăng ký user mới
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc username đã được sử dụng"
      });
    }    // Tạo user mới
    const user = new User({ 
      username, 
      email, 
      password: await bcrypt.hash(password, 10) // Hash thủ công
    });
    await user.save();

    // Tạo token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username 
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng ký"
    });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập chưa chính xác" });
    }
    
    console.log("User found:", user.email);
    console.log("Password from request:", password);
    console.log("Hashed password in DB:", user.password);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation result:", isPasswordValid);
    
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập chưa chính xác" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    
    // Cập nhật lastLogin
    user.lastLogin = new Date();
    await user.save();
    
    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Lấy thông tin user hiện tại
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user"
      });
    }

    res.json({
      success: true,
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin profile"
    });
  }
};

// Đăng xuất (optional - client có thể chỉ cần xóa token)
export const logout = (req, res) => {
  res.json({
    success: true,
    message: "Đăng xuất thành công"
  });
};
