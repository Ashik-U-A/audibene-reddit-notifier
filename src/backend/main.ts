import * as express from "express";
import { json } from "body-parser";
import { join } from "path";
import { UserRouter } from "./routes/UserRouter";
import { RedditRouter } from "./routes/RedditRouter";

let app: express.Application = express();
let _PORT = process.env.PORT || 3000;

app.use(json())
    .use(express.static(join(__dirname, "..", "frontend")))
    .use("/users", UserRouter)
    .use("/reddit", RedditRouter)
    .get("/", (req, res) => {
        res.sendFile(join(__dirname, "..", "frontend", "index.html"));
    })
    .get("/config-user", (req, res) => {
        res.sendFile(join(__dirname, "..", "frontend", "user-config.html"));
    })
    .listen(_PORT, () => {
        console.log(`Server Started and listening to PORT : ${_PORT}`);
    });
