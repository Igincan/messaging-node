import "dotenv/config";
import * as express from "express";
import * as session from "express-session";
import { Client } from "pg";

import { Controller } from "./controllers/controller";
import { GroupsController } from "./controllers/groups-controller";
import { PeopleController } from "./controllers/people-controller";
import { PageController } from "./controllers/page-controller";
import { UserController } from "./controllers/user-controller";

import { logError } from "./functions/errors";

(async () => {
    const port = process.env.PORT;

    const app = express();
    const apiRouter = express.Router();
    const defaultRouter = express.Router();

    app.use(express.static("dist/web"));
    app.use(session({ secret: "Wbh8n31btkkQBndpOEQ5" }));
    app.use("/api", apiRouter);
    app.use(defaultRouter);

    const dbClient: Client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? +process.env.DB_PORT : 5432
    });
    
    try {
        await dbClient.connect();
    } catch (e) {
        logError(e as string | object);
    } 

    const controllers: Controller[] = [
        new PeopleController(apiRouter, dbClient),
        new GroupsController(apiRouter, dbClient),
        new PageController(defaultRouter),
        new UserController(apiRouter, dbClient)
    ];
    
    controllers.forEach((controller) => {
        controller.init();
    });
    
    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}/.`);
    });
})();
