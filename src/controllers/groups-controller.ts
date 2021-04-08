import * as fs from "fs";

import { RequestType, Server, ErrorResponse } from "node-server";

import { Controller } from "./controller";
import { Group } from "../models/group";

export class GroupsController extends Controller {
    
    constructor(server: Server) {
        super(server);
    }

    init(): void {
        
        this.server.addRequest(RequestType.GET, "allGroups", async (args, body) => {
            return JSON.parse(fs.readFileSync("./data/groups.json", "utf8"));
        });
        
        this.server.addRequest(RequestType.GET, "group", async (args, body) => {
            let groups = JSON.parse(fs.readFileSync("./data/groups.json", "utf8")) as Group[];
            let group = groups.filter((group) => group.id === +args[0])[0];
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
            let groups = JSON.parse(fs.readFileSync("./data/groups.json", "utf8")) as Group[];
            group.id = Math.max(...groups.map((group) => group.id)) + 1;
            groups.push(group);
            fs.writeFileSync("./data/groups.json", JSON.stringify(groups));
            return group;
        });

        this.server.addRequest(RequestType.PUT, "editGroup", async (args, body) => {
            let newGroup = body as Group;
            let groups = JSON.parse(fs.readFileSync("./data/groups.json", "utf8")) as Group[];
            let oldGroup = groups.filter((oldGroup) => oldGroup.id === newGroup.id)[0];
            if (!oldGroup) {
                throw {
                    message: `Group with id [${newGroup.id}] not found!`,
                    code: 404
                } as ErrorResponse;
            }
            let index = groups.indexOf(oldGroup);
            groups[index] = newGroup;
            fs.writeFileSync("./data/groups.json", JSON.stringify(groups));
            return newGroup;
        });
        
        this.server.addRequest(RequestType.DELETE, "removeGroup", async (args, body) => {
            let groups = JSON.parse(fs.readFileSync("./data/groups.json", "utf8")) as Group[];
            let length = groups.length;
            groups = groups.filter((group) => group.id !== +args[0]);
            if (length === groups.length) {
                throw {
                    message: `Group with id [${args[0]}] not found!`,
                    code: 404
                } as ErrorResponse;
            }
            fs.writeFileSync("data/groups.json", JSON.stringify(groups));
            return { message: "OK" };
        });
    }
}