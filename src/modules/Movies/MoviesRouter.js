import { Router } from "express";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as moviesController from './MoviesController.js';
import * as moviesSchema from './MoviesSchema.js';
import { scrapeMovies } from "../../services/scrabeService.js";

const router = Router();

router.get('/', validation(moviesSchema.getMoviesQuery), moviesController.getMovies);
router.get('/:id', validation(moviesSchema.getSpecificMovieParams), moviesController.getSpecificMovie);
router.get('/search/:title',validation(moviesSchema.searchMovie),moviesController.searchMovie);
router.post('/scrape', async (req, res) => {
  try {
    await scrapeMovies();
    res.json({ success: true, message: 'Scraping started' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;