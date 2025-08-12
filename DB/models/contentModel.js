import { model, Schema } from "mongoose";

const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique:true,
    max: 50,
    min: 2,
  },
  genre: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: { type: String },
  },
  rating: {
    type: Number,
    min: 0,

  },
  type: {
    type: String,
    required: true,
    enum: ["movie", "music"],
  },
   videoUrl: { type: String ,required:true},
}, { timestamps: true });

export const Content = model("Content", contentSchema);
