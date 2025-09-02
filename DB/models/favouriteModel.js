import { model, Schema, Types } from "mongoose";

const favouriteSchema=new Schema({
    movieID:{
        type:Types.ObjectId,
        ref:'Content'
    },
    userID:{
        type:Types.ObjectId,
        ref:'User'
    }

},{timestamps:true});

export const Favourite=model('Favourite',favouriteSchema);