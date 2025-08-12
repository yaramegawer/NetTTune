import express from'express';
import { connectDB } from './DB/connection.js';
import dotenv from 'dotenv';
import moviesRouter from './src/modules/Movies/MoviesRouter.js';
import cron from 'node-cron';
import { scrapeMovies } from './src/services/scrabeService.js';
const app = express()

dotenv.config();
await connectDB();


app.use(express.json())
app.use('/movies',moviesRouter);

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



app.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`))