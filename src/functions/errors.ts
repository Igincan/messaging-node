import * as fs from "fs";

export const logError = (message: string | object) => {

    let stringMessage: string;

    if (typeof message === "object") {
        stringMessage = JSON.stringify(message);
    } else {
        stringMessage = message;
    }

    fs.appendFileSync("./log.txt", `${new Date().toUTCString()}: ${message}\n`);
};