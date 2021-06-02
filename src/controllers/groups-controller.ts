import { Router } from "express";
import { Client } from "pg";
import { json } from "body-parser";

import { Controller } from "./controller";
import { Group } from "../models/group";

export class GroupsController extends Controller {
    
    constructor(router: Router, private _dbClient: Client) {
        super(router);
    }

    init(): void {
        
        this.router.get("/allGroups", async (req, res) => {
            if (req.session.userIsLogged) {
                const groups = (await this._dbClient.query<Group>("SELECT * FROM \"Group\"")).rows;
                res.json(groups);
            } else {
                res.sendStatus(401);
            }
        });
        
        this.router.get("/group/:id", async (req, res) => {
            if (req.session.userIsLogged) {
                let group: Group;
                if (!+req.params.id) {
                    return res.status(404).json({
                        message: "Invalid argument!"
                    });
                }
                try {
                    group = (await this._dbClient.query<Group>(`SELECT * FROM "Group" WHERE "id" = ${req.params.id}`)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
                if (!group) {
                    return res.status(404).json({
                        message: `Group with id [${req.params.id}] not found!`
                    });
                }
                res.json(group);
            } else {
                res.sendStatus(401);
            }
        });
        
        this.router.post("/addGroup", json(), async (req, res) => {
            if (req.session.userIsLogged) {
                let group = req.body as Group;
    
                try {
                    const id = (await this._dbClient.query<{ id: number; }>(`INSERT INTO "Group" ("name") VALUES ('${group.name}') RETURNING "id"`)).rows[0].id;
                    group = (await this._dbClient.query<Group>(`SELECT * FROM "Group" WHERE "id" = ${id}`)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
                res.json(group);
            } else {
                res.sendStatus(401);
            }
        });

        this.router.put("/editGroup", json(), async (req, res) => {
            if (req.session.userIsLogged) {
                let newGroup = req.body as Group;
    
                try {
                    newGroup = (await this._dbClient.query<Group>(`
                        UPDATE "Group" SET "name" = '${newGroup.name}'
                        WHERE "id" = ${newGroup.id}
                        RETURNING *
                    `)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
                res.json(newGroup);
            } else {
                res.sendStatus(401);
            }
        });
        
        this.router.delete("/deleteGroup/:id", async (req, res) => {
            if (req.session.userIsLogged) {
                if (!+req.params.id)
                {
                    return res.status(404).json({
                        message: "Invalid argument!"
                    });
                }
                try {
                    await this._dbClient.query(`DELETE FROM "Group" WHERE ID = ${req.params.id}`);
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
    
                res.json({ message: "OK" });
            } else {
                res.sendStatus(401);
            }
        });
    }
}