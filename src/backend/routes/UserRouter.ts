import { Router } from "express";
import { UserService } from "../services/user-services/UserService";
import { RedditService } from "../services/reddit-services/RedditService";

export let UserRouter: Router = Router();

UserRouter.post("/", (req, res) => {
    let success = UserService.createNewUser(req.body.username, req.body.email);
    if (success) {
        RedditService.addNewUserListing(req.body.email);
    }
    res.send({
        userCreated: success
    });
}).get("/email=:email", (req, res) => {
    console.log(req.params);
    res.send(UserService.getUserName(req.params.email));
});
