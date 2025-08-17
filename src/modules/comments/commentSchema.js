import joi from 'joi';
import { isValidObjectId } from '../../middlewares/validationMiddleware.js';

export const addComment=joi.object({
    // userId:joi.string().custom(isValidObjectId),
    contentId:joi.string().custom(isValidObjectId).required(),
    text:joi.string().min(2).max(500).required(),
}).required();

export const deleteComment=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
}).required();

export const editComment=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
    text:joi.string().min(2).max(500).required(),
}).required();