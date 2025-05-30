import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username là bắt buộc"],
    unique: true,
    trim: true,
    minlength: [3, "Username phải có ít nhất 3 ký tự"],
    maxlength: [30, "Username không được quá 30 ký tự"]
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email không hợp lệ"]
  },
  password: {
    type: String,
    required: [true, "Password là bắt buộc"],
    minlength: [6, "Password phải có ít nhất 6 ký tự"]
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {  timestamps: true
});

// Loại bỏ password khỏi JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
