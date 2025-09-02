import joi from 'joi';
import { isValidObjectId } from '../../middlewares/validationMiddleware.js';

export const addFavMovie = joi.object({
    id: joi.string().custom(isValidObjectId).required(),
}).required();

export const deleteFavMovie = joi.object({
    movieId: joi.string().custom(isValidObjectId).required(),
}).required();

