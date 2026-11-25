import {Router} from 'express';
import * as favMovieSchema from './favMovieSchema.js';
import * as favMovieController from './favMovieController.js';
import { validation } from '../../middlewares/validation_middleware.js';
const router=Router();

router.post('/:id',validation(favMovieSchema.addFavMovie),favMovieController.addFavMovie);
router.get('/',favMovieController.getFavMovie);
router.delete('/:movieId',validation(favMovieSchema.deleteFavMovie),favMovieController.deleteFavMovie);

export default router;