import { Router } from "express";
import * as moviesController from './MoviesController.js';
const router=Router();

router.get('/',moviesController.getMovies);
router.get('/:id',moviesController.getSpecificMovie);

export default router;