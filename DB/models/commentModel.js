import { Schema, Types, model } from "mongoose";

const commentSchema=new Schema({
 
//   userId:{
//     type:Types.ObjectId,
//     ref:User
//   },TODO
  contentId:{
    type:Types.ObjectId,
    ref:'Content',
    required:true
  },
  text:{
    type:String,
    required:true,
    maxlength: 500,
    minlength: 2
  },

},{timestamps:true});

export const Comment=model('Comment',commentSchema);