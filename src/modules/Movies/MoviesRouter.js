import { Router } from "express";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as moviesController from './MoviesController.js';
import * as moviesSchema from './MoviesSchema.js';

const router = Router();

router.get('/', validation(moviesSchema.getMoviesQuery), moviesController.getMovies);
router.get('/:id', validation(moviesSchema.getSpecificMovieParams), moviesController.getSpecificMovie);

export default router;