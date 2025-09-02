import express from'express';
import { connectDB } from './DB/connection.js';
import dotenv from 'dotenv';
import moviesRouter from './src/modules/Movies/MoviesRouter.js';
import commentRouter from './src/modules/comments/commentRouter.js';
import user_router from './src/modules/user/user.route.js';
import favMovieRouter from './src/modules/FavouriteMovie/favMovieRouter.js';
import cron from 'node-cron';
import { scrapeMovies } from './src/services/scrabeService.js';
import cors from 'cors';
const app = express()

dotenv.config();
await connectDB();

app.use(cors());

//adding socket.io configuration
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
export const io = new Server(server, {
  cors: {
    origin: "*", // adjust for security
    methods: ["GET", "POST"]
  }
});

app.use(express.json())
app.use('/movies',moviesRouter);
app.use('/comments',commentRouter)
app.use('/user',user_router)
app.use('/favourites',favMovieRouter);

cron.schedule("0 9 */3 * *", () => {
  console.log("Running scheduled scrapeMovies task...");
  scrapeMovies({}, { json: () => {} }, () => {});
});

app.all('/{*any}',(req,res,next)=>{
    return next(new Error("Page not found",{cause:404}));
});

app.use((error,req,res,next)=>{
    const statusCode= error.cause || 500;

    return res.json({
        success:false,
        message:error.message,
        stack:error.stack
    });
})



//app.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`))

io.on('connection',(socket)=>{
    console.log('User connected ',socket.id)
    socket.on('comment',(msg)=>{
        console.log("New comment recieved",msg)
    })
})

server.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`))
