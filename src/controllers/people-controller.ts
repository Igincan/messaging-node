import { Router } from "express";
import { Client } from "pg";
import { json } from "body-parser";

import { Controller } from "./controller";
import { Person } from "../models/person";

export class PeopleController extends Controller {

    constructor(router: Router, private _dbClient: Client) {
        super(router);
    }

    init(): void {

        this.router.get("/allPeople", async (req, res) => {
            if (req.session.userIsLogged) {
                const people = (await this._dbClient.query<Person>("SELECT * FROM \"Person\" ORDER BY \"id\" ASC")).rows;
                res.json(people);
            } else {
                res.sendStatus(401);
            }
        });

        this.router.get("/person/:id", async (req, res) => {
            if (req.session.userIsLogged) {
                let person: Person;
                if (!+req.params.id) {
                    return res.status(404).json({
                        message: "Invalid argument!"
                    });
                }
                try {
                    person = (await this._dbClient.query<Person>(`SELECT * FROM "Person" WHERE "id" = ${req.params.id}`)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
                if (!person) {
                    res.status(404).json({
                        message: `Person with id [${req.params.id}] not found!`
                    });
                }
                res.json(person);
            } else {
                res.sendStatus(401);
            }
        });
        
        this.router.post("/addPerson", json(), async (req, res) => {
            if (req.session.userIsLogged) {
                let person = req.body as Person;
                
                try {
                    const id = (await this._dbClient.query<Person>(`
                        INSERT INTO "Person" ("groupId", "firstName", "lastName", "phoneNumber", "email")
                        VALUES (${person.groupId}, '${person.firstName}', '${person.lastName}', '${person.phoneNumber}', '${person.email}')
                        RETURNING "id"
                    `)).rows[0].id;
                    person = (await this._dbClient.query<Person>(`SELECT * FROM "Person" WHERE "id" = ${id}`)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
                res.json(person);
            } else {
                res.sendStatus(401);
            }
        });

        this.router.put("/editPerson", json(), async (req, res) => {
            if (req.session.userIsLogged) {
                let newPerson = req.body as Person;
                try {
                    newPerson = (await this._dbClient.query<Person>(`
                        UPDATE "Person" SET
                            "groupId" = ${newPerson.groupId},
                            "firstName" = '${newPerson.firstName}',
                            "lastName" = '${newPerson.lastName}',
                            "phoneNumber" = '${newPerson.phoneNumber}',
                            "email" = '${newPerson.email}'
                        WHERE "id" = ${newPerson.id}
                        RETURNING *
                    `)).rows[0];
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
                res.json(newPerson);
            } else {
                res.sendStatus(401);
            }
        });
        
        this.router.delete("/deletePerson/:id", async (req, res) => {
            if (req.session.userIsLogged) {
                if (!+req.params.id) {
                    return res.status(404).json({
                        message: "Invalid argument!"
                    });
                }
                try {
                    await this._dbClient.query(`DELETE FROM "Person" WHERE "id" = ${req.params.id}`);
                } catch (error) {
                    this.logError(JSON.stringify(error));
                    return res.status(500).json({
                        message: "Internal server error!"
                    });
                }
    
                res.json({ message: "OK" });
            } else {
                res.sendStatus(401);
            }
        });
    }
}