import { Server } from "node-server";

export abstract class Controller {

    constructor(protected server: Server) {}

    abstract init(): void;
}