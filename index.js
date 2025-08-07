import express from "express";
import db_connection from "./Database/connection.js";
import { config } from "dotenv";
import { user_router } from "./src/modules/index.js";
import { global_response } from "./src/middlewares/index.js";
config();
const app = express();
const port = process.env.PORT;
await db_connection();

app.use(express.json());
app.use("/user",user_router)
app.use(global_response)
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
