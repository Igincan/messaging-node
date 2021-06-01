import { Router } from "express";
import { json } from "body-parser";

import { Controller } from "./controller";
import { Credentials } from "../models/credentials";

declare module "express-session" {
    interface SessionData {
        userIsLogged: boolean;
        username: string;
    }
}

export class UserController extends Controller {
    
    constructor(router: Router) {
        super(router);
    }

    init(): void {
        
        this.router.post("/login", json(), (req, res) => {
            const credentials = req.body as Credentials;

            if (req.session.userIsLogged) {
                res.json({ message: "User already logged in!" });
            } else {
                if (credentials.username === "admin" && credentials.password === "test123") {
                    req.session.userIsLogged = true;
                    req.session.username = credentials.username;
                    res.json({ message: `User ${credentials.username} successfully logged in!` });
                } else {
                    res.status(401).json({ message: "Invalid username or password!"});
                }
            }
        });

        this.router.get("/isLogged", (req, res) => {
            if (req.session.userIsLogged === undefined) {
                req.session.userIsLogged = false;
            }
            res.json(req.session.userIsLogged);
        });

        this.router.get("/logged", (req, res) => {
            if (req.session.userIsLogged) {
                res.json({
                    username: req.session.username
                });
            } else {
                res.status(401).json({
                    message: "User is not logged in!"
                });
            }
        });

        this.router.get("/logout", (req, res) => {
            if (req.session.userIsLogged) {
                req.session.username = undefined;
                req.session.userIsLogged = false;
                res.json({
                    message: "Successfully logged out!"
                });
            } else {
                res.status(401).json({
                    message: "User is not logged in!"
                });
            }
        });
    }
}