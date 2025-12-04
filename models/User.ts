import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
}


const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: { type: String, required: true, trim: true },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
