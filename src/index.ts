import { Server } from "node-server";

import { Controller } from "./controllers/controller";
import { GroupsController } from "./controllers/groups-controller";
import { PeopleController } from "./controllers/people-controller";

let server: Server = new Server("web");

let controllers: Controller[] = [
    new PeopleController(server),
    new GroupsController(server)
];

controllers.forEach((controller) => {
    controller.init();
});

server.launchServer();
