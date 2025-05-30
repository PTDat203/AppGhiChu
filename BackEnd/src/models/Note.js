import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tiêu đề ghi chú là bắt buộc"],
    trim: true,
    maxlength: [100, "Tiêu đề không được quá 100 ký tự"]
  },
  content: {
    type: String,
    required: [true, "Nội dung ghi chú là bắt buộc"],
    trim: true,
    maxlength: [5000, "Nội dung không được quá 5000 ký tự"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Chỉ giữ lại index cơ bản để sắp xếp theo thời gian tạo
noteSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model("Note", noteSchema);
