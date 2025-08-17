import joi from 'joi';
import { isValidObjectId } from '../../middlewares/validationMiddleware.js';

// Validation for getMovies query parameters
export const getMoviesQuery = joi.object({
    rating: joi.number().min(0).max(10).optional(),
    sort: joi.number().valid(-1, 1).optional(),
    page: joi.number().integer().min(1).max(1000).optional(),
}).required();

// Validation for getSpecificMovie route parameter
export const getSpecificMovieParams = joi.object({
    id: joi.string().custom(isValidObjectId).required(),
}).required();
