import { Router } from "express";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as moviesController from './MoviesController.js';
import * as moviesSchema from './MoviesSchema.js';
import { auth } from "../../middlewares/auth_middleware.js";

const router = Router();

router.get('/', auth(),validation(moviesSchema.getMoviesQuery), moviesController.getMovies);
router.get('/:id', auth(),validation(moviesSchema.getSpecificMovieParams), moviesController.getSpecificMovie);
router.get('/search/:title',auth(),validation(moviesSchema.searchMovie),moviesController.searchMovie);
export default router;