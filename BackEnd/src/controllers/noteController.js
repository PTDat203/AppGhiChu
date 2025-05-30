import Note from "../models/Note.js";

// Lấy tất cả ghi chú của user trong ngày
export const getTodayNotes = async (req, res) => {
  try {
    const notes = await Note.getTodayNotes(req.user.id)
      .populate('author', 'username email');

    res.json({
      success: true,
      message: "Lấy ghi chú hôm nay thành công",
      data: {
        notes,
        total: notes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy ghi chú hôm nay"
    });
  }
};

// Lấy tất cả ghi chú của user
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    res.json({
      success: true,
      message: "Lấy danh sách ghi chú thành công",
      data: { notes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách ghi chú"
    });
  }
};

// Lấy chi tiết 1 ghi chú
export const getNoteById = async (req, res) => {
  try {    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user.id
    }).populate('author', 'username email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ghi chú"
      });
    }

    res.json({
      success: true,
      message: "Lấy chi tiết ghi chú thành công",
      data: { note }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết ghi chú"
    });
  }
};

// Tạo ghi chú mới
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;    
    const note = new Note({
      title,
      content,
      author: req.user.id,
      category: 'personal',
      priority: 'medium'
    });

    await note.save();
    await note.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: "Tạo ghi chú thành công",
      data: { note }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi tạo ghi chú"
    });
  }
};

// Cập nhật ghi chú
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { title, content },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ghi chú để cập nhật"
      });
    }

    res.json({
      success: true,
      message: "Cập nhật ghi chú thành công",
      data: { note }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật ghi chú"
    });
  }
};

// Xóa ghi chú
export const deleteNote = async (req, res) => {
  try {    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ghi chú để xóa"
      });
    }

    res.json({
      success: true,
      message: "Xóa ghi chú thành công",
      data: { note }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa ghi chú"
    });
  }
};

// Archive/Unarchive ghi chú
export const toggleArchiveNote = async (req, res) => {
  try {    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ghi chú"
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();
    await note.populate('author', 'username email');

    res.json({
      success: true,
      message: note.isArchived ? "Lưu trữ ghi chú thành công" : "Bỏ lưu trữ ghi chú thành công",
      data: { note }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thay đổi trạng thái lưu trữ"
    });
  }
};
