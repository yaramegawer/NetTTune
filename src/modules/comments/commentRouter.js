import {Router} from 'express';
import { validation } from '../../middlewares/validationMiddleware.js';
import { addComment, deleteComment, editComment } from './commentController.js';
import * as commentSchema from './commentSchema.js';
import { auth } from '../../middlewares/auth_middleware.js';

const router=Router();

router.post('/',auth(),validation(commentSchema.addComment),addComment);
router.delete('/:id',auth(),validation(commentSchema.deleteComment),deleteComment);
router.put('/:id',auth(),validation(commentSchema.editComment),editComment);


export default router;