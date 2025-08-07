import mongoose from "mongoose";
const { Schema, model } = mongoose;

const user_schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "premium"],
      default: "user",
    },
    subscription_status: {
      type: String,
      enum: ["active", "inactive", "canceled"],
      default: "inactive",
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "content",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export const user = mongoose.models.user || model("user", user_schema);
