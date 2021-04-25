import * as fs from "fs";

import { RequestType, Server, ErrorResponse, MessageResponse } from "node-server";
import { Client } from "pg";

import { Controller } from "./controller";
import { Person } from "../models/person";

export class PeopleController extends Controller {

    constructor(server: Server, private dbClient: Client) {
        super(server);
    }

    init(): void {
        
        this.server.addRequest(RequestType.GET, "allPeople", async (args, body) => {
            return (await this.dbClient.query<Person>(`SELECT * FROM "Person" ORDER BY "id" ASC`)).rows;
        });
        
        this.server.addRequest(RequestType.GET, "person", async (args, body) => {
            let person: Person;
            if (!+args[0]) {
                throw {
                    message: `Invalid argument!`,
                    code: 404
                } as ErrorResponse;
            }
            try {
                person = (await this.dbClient.query<Person>(`SELECT * FROM "Person" WHERE ID = ${args[0]}`)).rows[0];
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }
            if (!person) {
                throw {
                    message: `Person with id [${args[0]}] not found!`,
                    code: 404
                } as ErrorResponse;
            }
            return person;
        });
        
        this.server.addRequest(RequestType.POST, "addPerson", async (args, body) => {
            let person = body as Person;
            try {
                let id = (await this.dbClient.query(`
                    INSERT INTO "Person" ("groupId", "firstName", "lastName", "phoneNumber", "email")
                    VALUES (${person.groupId}, '${person.firstName}', '${person.lastName}', '${person.phoneNumber}', '${person.email}')
                    RETURNING ID
                `)).rows[0].id;
                person = (await this.dbClient.query<Person>(`SELECT * FROM "Person" WHERE ID = ${id}`)).rows[0];
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }
            return person;
        });

        this.server.addRequest(RequestType.PUT, "editPerson", async (args, body) => {
            let newPerson = body as Person;
            try {
                newPerson = (await this.dbClient.query(`
                    UPDATE "Person" SET
                        "groupId" = ${newPerson.groupId},
                        "firstName" = '${newPerson.firstName}',
                        "lastName" = '${newPerson.lastName}',
                        "phoneNumber" = '${newPerson.phoneNumber}',
                        "email" = '${newPerson.email}'
                    WHERE ID = ${newPerson.id}
                    RETURNING *
                `)).rows[0];
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }
            return newPerson;
        });
        
        this.server.addRequest(RequestType.DELETE, "deletePerson", async (args, body) => {
            if (!+args[0])
            {
                throw {
                    message: `Invalid argument!`,
                    code: 404
                } as ErrorResponse;
            }
            try {
                await this.dbClient.query(`DELETE FROM "Person" WHERE ID = ${args[0]}`);
            } catch (error) {
                this.logError(JSON.stringify(error));
                throw {
                    message: "Something went wrong!",
                    code: 500
                } as ErrorResponse;
            }

            return { message: "OK" } as MessageResponse;
        });
    }
}