import * as bcrypt from "bcrypt";
import { Router } from "express";
import { json } from "body-parser";
import { Client } from "pg";

import { Controller } from "./controller";
import { Credentials } from "../models/credentials";
import { User } from "../models/user";

declare module "express-session" {
    interface SessionData {
        userIsLogged: boolean;
        username: string;
    }
}

export class UserController extends Controller {
    
    constructor(router: Router, private _dbClient: Client) {
        super(router);
    }

    init(): void {
        
        this.router.post("/login", json(), async (req, res) => {
            const credentials = req.body as Credentials;

            if (req.session.userIsLogged) {
                res.status(400).json("User already logged in!");
            } else {
                let user: User;
                try {
                    user = (await this._dbClient.query<User>(`
                        SELECT * FROM "User" WHERE "name" = '${credentials.username}'
                    `)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.sendStatus(500);
                }
                if (!user) {
                    return res.status(401).json("Invalid username or password!");
                }
                let correct: boolean;
                try {
                    correct = await bcrypt.compare(credentials.password, user.hash);
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.sendStatus(500);
                }
                if (correct) {
                    req.session.userIsLogged = true;
                    req.session.username = credentials.username;
                    res.json(`User ${credentials.username} successfully logged in!`);
                } else {
                    res.status(401).json("Invalid username or password!");
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
                res.json(req.session.username);
            } else {
                res.status(401).json("User is not logged in!");
            }
        });

        this.router.get("/logout", (req, res) => {
            if (req.session.userIsLogged) {
                req.session.userIsLogged = false;
                res.json("Successfully logged out!");
            } else {
                res.status(401).json("User is not logged in!");
            }
        });

        // this.router.get("/userData", (req, res) => {
        //     if (req.session.userIsLogged) {

        //     } else {
        //         res.sendStatus(401);
        //     }
        // });
    }
}