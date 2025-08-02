import express from "express";
import db_connection from "./Database/connection.js";
import { config } from "dotenv";
config();
const app = express();
const port = process.env.PORT;
await db_connection();

app.use(express.json());
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
