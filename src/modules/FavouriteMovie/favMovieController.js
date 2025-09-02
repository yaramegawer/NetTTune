import { Content } from "../../../DB/models/contentModel.js";
import { Favourite } from "../../../DB/models/favouriteModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// POST /users/:id/favorites – Add movie to favorites.

export const addFavMovie=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const userID=req.authUser._id;

    const movie=await Content.findById(id);

    if(!movie)return next(new Error("Movie not found",{cause:404}));

    const favMovie = await Favourite.findOne({ movieID: id, userID });
    if (favMovie) return next(new Error("Movie already added to favourites"));

    const favorites=await Favourite.create({movieID:movie._id,userID});

    return res.json({
        success:true,
        message:"movie added to favourites successfully",
        favorites
    })

});


// GET /users/:id/favorites – Get user’s favorite movies.
export const getFavMovie=asyncHandler(async(req,res,next)=>{
    const userID=req.authUser._id;

    const favourites=await Favourite.find({userID});

    if(!favourites ||  favourites.length === 0) return next(new Error("No favourite movies found",{cause:404}));

    const movieIDs = favourites.map(fav => fav.movieID);

    // Find all movies whose IDs are in the favourites list
    const movies = await Content.find({ _id: { $in: movieIDs } });

    return res.json({
        success:true,
        movies
    })

});

// DELETE /users/:id/favorites/:movieId – Remove movie from favorites.

export const deleteFavMovie=asyncHandler(async(req,res,next)=>{
    const { movieId } = req.params;
    const userID = req.authUser._id;

    const favourite = await Favourite.findOneAndDelete({ movieID: movieId, userID });

    if (!favourite) {
        return next(new Error("Movie not found in your favourites", { cause: 404 }));
    }

    return res.json({
        success:true,
        message:"Movies removed from favourites successfully"
    })


});