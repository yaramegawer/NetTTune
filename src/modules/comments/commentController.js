import { Comment } from "../../../DB/models/commentModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { get_socket } from "../../utils/socket.js";

export const addComment = asyncHandler(async (req, res, next) => {
  const userId = req.authUser._id;
  const comment = await Comment.create({ userId: userId, ...req.body });

  get_socket().emit("newComment", comment);
  return res.json({
    success: true,
    msg: "Comment created successfully",
    comment,
  });
});

//Delete Comment
export const deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findByIdAndDelete(id);

  if (!comment) return next(new Error("Comment not found", { cause: 404 }));
  get_socket().emit("deleteComment", comment);

  return res.json({
    success: true,
    msg: "Comment deleted successfully",
  });
});
//Edit Comment
export const editComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;

  const comment = await Comment.findByIdAndUpdate(id, { text }, { new: true });

  if (!comment) return next(new Error("Comment not found", { cause: 404 }));
  get_socket().emit("editComment", comment);

  return res.json({
    success: true,
    msg: "Comment updated successfully",
    comment,
  });
});
