import * as fs from "fs";

import { Server } from "node-server";

export abstract class Controller {

    constructor(protected server: Server) {}

    abstract init(): void;

    protected logError(message: string) {
        console.error(JSON.parse(message));
        fs.appendFileSync("./log.txt", `(${new Date().toUTCString()}) ${this.constructor.name}: ${message}\n`);
    }
}