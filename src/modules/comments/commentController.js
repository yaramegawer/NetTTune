import { Comment } from "../../../DB/models/commentModel.js";
import { io } from "../../../index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addComment=asyncHandler(async(req,res,next)=>{

    const comment=await Comment.create({...req.body})

    io.emit("newComment", comment);
    return res.json({
        success:true,
        msg:"Comment created successfully",
        comment
    })
});

//Delete Comment 
export const deleteComment=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const comment=await Comment.findByIdAndDelete(id);

    if(!comment)return next(new Error("Comment not found",{cause:404}));
    io.emit("deleteComment", comment);
  
    return res.json({
        success:true,
        msg:"Comment deleted successfully",
    });
})
//Edit Comment
export const editComment=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const {text}=req.body;

    const comment=await Comment.findByIdAndUpdate(id,{ text }, { new: true });

    if(!comment)return next(new Error("Comment not found",{cause:404}));
    io.emit("editComment", comment);
  
    return res.json({
        success:true,
        msg:"Comment updated successfully",
        comment
    });
})
