import { Server } from "node-server";
import { Client } from "pg";

import { Controller } from "./controllers/controller";
import { GroupsController } from "./controllers/groups-controller";
import { PeopleController } from "./controllers/people-controller";

(async () => {
    let server: Server = new Server("web");
    let dbClient: Client = new Client({
        user: "postgres",
        host: "localhost",
        database: "messaging",
        password: "naruto1414",
        port: 5432
    });
    
    await dbClient.connect();

    let controllers: Controller[] = [
        new PeopleController(server, dbClient),
        new GroupsController(server, dbClient)
    ];
    
    controllers.forEach((controller) => {
        controller.init();
    });
    
    server.launchServer();
})();
