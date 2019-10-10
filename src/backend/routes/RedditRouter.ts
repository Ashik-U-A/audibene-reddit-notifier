import { Router } from "express";
import { RedditService } from "../services/reddit-services/RedditService";
import { UserMailScheduler } from "../logic/UserMailScheduler";

export let RedditRouter: Router = Router();

RedditRouter.get("/email=:email", (req, res) => {
    res.send(RedditService.getDetails(req.params.email));
}).put("/", (req, res) => {
    if (!req.body.newsletter) {
        UserMailScheduler.clearSchedule(req.body.user);
    } else {
        UserMailScheduler.schedule(req.body.user, req.body.channels);
    }
    res.send(
        RedditService.setConfigurationForUser({
            user: req.body.user,
            channels: req.body.channels,
            subscribe: req.body.newsletter
        })
    );
});
