import express from "express";
import { connectDB } from "./DB/connection.js";
import dotenv from "dotenv";
import moviesRouter from "./src/modules/Movies/MoviesRouter.js";
import commentRouter from "./src/modules/comments/commentRouter.js";
import favMovieRouter from "./src/modules/FavouriteMovie/favMovieRouter.js";
import cron from "node-cron";
import { scrapeMovies } from "./src/services/scrabeService.js";
import cors from "cors";
import { init_socket } from "./src/utils/socket.js";
const app = express();

dotenv.config();
await connectDB();

app.use(cors());

app.use(express.json());
app.use("/movies", moviesRouter);
app.use("/comments", commentRouter);
app.use("/favourites", favMovieRouter);

cron.schedule("0 9 */3 * *", () => {
  console.log("Running scheduled scrapeMovies task...");
  scrapeMovies({}, { json: () => {} }, () => {});
});

app.all("/{*any}", (req, res, next) => {
  return next(new Error("Page not found", { cause: 404 }));
});

app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;

  return res.json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(process.env.PORT || 5000, () =>
    console.log(`Example app listening at http://localhost:${process.env.PORT || 5000}`)
  );
  
  const io = init_socket(server);
  io.on("connection", (socket) => {
    console.log("User connected ", socket.id);
    socket.on("comment", (msg) => {
      console.log("New comment recieved", msg);
    });
  });
}

export default app;
