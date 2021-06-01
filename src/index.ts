import * as express from "express";
import * as session from "express-session";
import { Client } from "pg";

import { Controller } from "./controllers/controller";
import { GroupsController } from "./controllers/groups-controller";
import { PeopleController } from "./controllers/people-controller";
import { PageController } from "./controllers/page-controller";
import { UserController } from "./controllers/user-controller";

(async () => {
    const port = 5500;

    const app = express();
    const apiRouter = express.Router();
    const defaultRouter = express.Router();

    app.use(express.static("dist/web"));
    app.use(session({ secret: "test123" }));
    app.use("/api", apiRouter);
    app.use(defaultRouter);

    const dbClient: Client = new Client({
        user: "postgres",
        host: "localhost",
        database: "messaging",
        password: "naruto1414",
        port: 5432
    });
    
    await dbClient.connect();

    const controllers: Controller[] = [
        new PeopleController(apiRouter, dbClient),
        new GroupsController(apiRouter, dbClient),
        new PageController(defaultRouter),
        new UserController(apiRouter)
    ];
    
    controllers.forEach((controller) => {
        controller.init();
    });
    
    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}/.`);
    });
})();
