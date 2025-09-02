import { Comment } from "../../../DB/models/commentModel.js";
import { Content } from "../../../DB/models/contentModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getMovies = asyncHandler(async (req, res, next) => {
    let { rating,genre, sort, page } = req.query;

    // Parse and validate page with better defaults
    page = parseInt(page, 10) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    // Build filter with validation
    let filter = { 
        type: 'movie',
        rating: { $lte: 10 } 
    };


    if(genre){
        filter.genre = genre;
    }

    // Add rating filter if provided (validation ensures it's a valid number)
    if (rating !== undefined) {
        const parsed = parseFloat(rating);
        filter.rating = { $gte: parsed, $lt: parsed + 1 };
    }
        let query = Content.find(filter);

    // Add sorting if provided (validation ensures it's -1 or 1)
    if (sort !== undefined) {
        const sortValue = parseInt(sort, 10);
        if (sortValue === -1) {
            query = query.sort({ rating: -1 });
        } else if (sortValue === 1) {
            query = query.sort({ rating: 1 });
        }
    }

    // Execute query with pagination
    const movies = await query.limit(limit).skip(skip);
    
    // Get total count for pagination info
    const totalMovies = await Content.countDocuments(filter);
    const totalPages = Math.ceil(totalMovies / limit);

    return res.json({
        success: true,
        page,
        limit,
        totalMovies,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        movies,
    });
});

export const getSpecificMovie = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Find the movie (validation ensures id is valid ObjectId)
    const movie = await Content.findById(id);

    if (!movie) {
        return res.status(404).json({ 
            success: false, 
            message: 'Movie not found',
            error: 'MOVIE_NOT_FOUND'
        });
    }

    // Get comments for this movie with pagination
    const comments = await Comment.find({ contentId: id })
        .sort({ createdAt: -1 }) 
        .populate('userId', 'username') 
        .limit(100); 

    // Get total comment count
    const totalComments = await Comment.countDocuments({ contentId: id });

    return res.json({
        success: true,
        movie,
        comments,
        totalComments,
        hasMoreComments: totalComments > comments.length
    });
});

export const searchMovie=asyncHandler(async(req,res,next)=>{
    let {title}=req.params;
    if(!title) return next(new Error("Movie not available!",{cause:404}));
    const movie = await Content.find({  title: { $regex: `\\b${title}\\b`, $options: 'i' } });

    return res.json({
        success:true,
        movie
    })
})