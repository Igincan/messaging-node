import { Router } from "express";

import { Controller } from "./controller";

export class PageController extends Controller {

    private readonly _routes = [
        "/home",
        "/database",
        "/send"
    ];
    
    constructor(router: Router) {
        super(router);
    }
    
    init(): void {

        this._routes.forEach((route) => {
            this.router.get(route, (req, res) => {
                res.sendFile("index.html", { root: `${__dirname}/../web` });
            });
        });
    }
}