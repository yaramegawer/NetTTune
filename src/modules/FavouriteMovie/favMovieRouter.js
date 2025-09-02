import {Router} from 'express';
import * as favMovieSchema from './favMovieSchema.js';
import * as favMovieController from './favMovieController.js';
import { auth } from '../../middlewares/auth_middleware.js';
import { validation } from '../../middlewares/validation_middleware.js';
const router=Router();

router.post('/:id',auth(),validation(favMovieSchema.addFavMovie),favMovieController.addFavMovie);
router.get('/',auth(),favMovieController.getFavMovie);
router.delete('/:movieId',auth(),validation(favMovieSchema.deleteFavMovie),favMovieController.deleteFavMovie);

export default router;