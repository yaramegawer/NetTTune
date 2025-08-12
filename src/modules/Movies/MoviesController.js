import { Content } from "../../../DB/models/contentModel.js";
import { scrapeMovies } from "../../services/scrabeService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getMovies=asyncHandler(async(req,res,next)=>{
    let { rating, sort, page } = req.query;

    page = parseInt(page, 10) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    let filter = { 
        type: 'movie',
        rating: { $lte: 10 } 
    };

    if (rating) {
        filter.rating.$gte = parseFloat(rating);
    }

    let query = Content.find(filter);

    if (sort == -1) {
        query = query.sort({ rating: -1 });
    } else if (sort == 1) {
        query = query.sort({ rating: 1 });
    }

    const movies = await query.limit(limit).skip(skip);

    return res.json({
        success: true,
        page,
        movies,
    });
});

export const getSpecificMovie=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const movie=await Content.findById(id);

    return res.json({
        success:true,
        movie
    })
});