import { Router } from "express";
import { RedditService } from "../services/reddit-services/RedditService";

export let RedditRouter: Router = Router();

RedditRouter.get("/trending", (req, res) => {
    RedditService.getTrendingSubreddits().then(data => {
        res.send(data);
    });
})
    .get("/email=:email", (req, res) => {
        res.send(RedditService.getDetails(req.params.email));
    })
    .put("/", (req, res) => {
        res.send(
            RedditService.setConfigurationForUser({
                user: req.body.user,
                channels: req.body.channels,
                subscribe: req.body.newsletter
            })
        );
    });
