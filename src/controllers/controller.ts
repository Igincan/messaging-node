import * as fs from "fs";

import { Router } from "express";

export abstract class Controller {

    constructor(protected router: Router) {}

    abstract init(): void;

    protected logError(message: string): void {
        console.error(JSON.parse(message));
        fs.appendFileSync("./log.txt", `(${new Date().toUTCString()}) ${this.constructor.name}: ${message}\n`);
    }
}