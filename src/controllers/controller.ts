import * as fs from "fs";

import { Router } from "express";

export abstract class Controller {

    constructor(protected router: Router) {}

    abstract init(): void;

    protected logError(message: string | object): void {

        console.error(message);

        let stringMessage: string;

        if (typeof message === "object") {
            stringMessage = JSON.stringify(message);
        } else {
            stringMessage = message;
        }
        
        fs.appendFileSync("./log.txt", `${new Date().toUTCString()}: [${this.constructor.name}]: ${stringMessage}\n`);
    }
}