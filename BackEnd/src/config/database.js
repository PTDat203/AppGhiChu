import mongoose from "mongoose";

export const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    process.exit(1);
  }
};