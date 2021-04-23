import * as fs from "fs";

import { RequestType, Server, ErrorResponse, MessageResponse } from "node-server";
import { Client } from "pg";

import { Controller } from "./controller";
import { Group } from "../models/group";

export class GroupsController extends Controller {
    
    constructor(server: Server, private dbClient: Client) {
        super(server);
    }

    init(): void {
        
        this.server.addRequest(RequestType.GET, "allGroups", async (args, body) => {
            return (await this.dbClient.query<Group>(`SELECT * FROM "Group"`)).rows;
        });
        
        this.server.addRequest(RequestType.GET, "group", async (args, body) => {
            let group: Group;
            if (!+args[0]) {
                throw {
                    message: `Invalid argument!`,
                    code: 404
                } as ErrorResponse;
            }
            try {
                group = (await this.dbClient.query<Group>(`SELECT * FROM "Group" WHERE ID = ${args[0]}`)).rows[0];
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }
            if (!group) {
                throw {
                    message: `Group with id [${args[0]}] not found!`,
                    code: 404
                } as ErrorResponse;
            }
            return group;
        });
        
        this.server.addRequest(RequestType.POST, "addGroup", async (args, body) => {
            let group = body as Group;
            try {
                let id = (await this.dbClient.query(`INSERT INTO "Group" ("name") VALUES ('${group.name}') RETURNING ID`)).rows[0].id;
                group = (await this.dbClient.query<Group>(`SELECT * FROM "Group" WHERE ID = ${id}`)).rows[0];
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }
            return group;
        });

        this.server.addRequest(RequestType.PUT, "editGroup", async (args, body) => {
            let newGroup = body as Group;
            try {
                newGroup = (await this.dbClient.query(`UPDATE "Group" SET "name" = '${newGroup.name}' WHERE ID = ${newGroup.id} RETURNING *`)).rows[0];
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }
            return newGroup;
        });
        
        this.server.addRequest(RequestType.DELETE, "deleteGroup", async (args, body) => {
            if (!+args[0])
            {
                throw {
                    message: `Invalid argument!`,
                    code: 404
                } as ErrorResponse;
            }
            try {
                await this.dbClient.query(`DELETE FROM "Group" WHERE ID = ${args[0]}`);
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }

            return { message: "OK" } as MessageResponse;
        });
    }
}