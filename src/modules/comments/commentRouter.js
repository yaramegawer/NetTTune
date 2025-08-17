import {Router} from 'express';
import { validation } from '../../middlewares/validationMiddleware.js';
import { addComment, deleteComment, editComment } from './commentController.js';
import * as commentSchema from './commentSchema.js';
const router=Router();

router.post('/',validation(commentSchema.addComment),addComment);
router.delete('/:id',deleteComment);
router.put('/:id',validation(commentSchema.editComment),editComment);


export default router;