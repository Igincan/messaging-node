import * as fs from "fs";

import { RequestType, Server, ErrorResponse } from "node-server";

import { Controller } from "./controller";
import { Person } from "../models/person";

export class PeopleController extends Controller {

    constructor(server: Server) {
        super(server);
    }

    init(): void {
        
        this.server.addRequest(RequestType.GET, "allPeople", async (args, body) => {
            return JSON.parse(fs.readFileSync("./data/people.json", "utf8"));
        });
        
        this.server.addRequest(RequestType.GET, "person", async (args, body) => {
            let people = JSON.parse(fs.readFileSync("./data/people.json", "utf8")) as Person[];
            let person = people.filter((person) => person.id === +args[0])[0];
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
            let people = JSON.parse(fs.readFileSync("./data/people.json", "utf8")) as Person[];
            person.id = Math.max(...people.map((person) => person.id)) + 1;
            people.push(person);
            fs.writeFileSync("./data/people.json", JSON.stringify(people));
            return person;
        });

        this.server.addRequest(RequestType.PUT, "editPerson", async (args, body) => {
            let newPerson = body as Person;
            let people = JSON.parse(fs.readFileSync("./data/people.json", "utf8")) as Person[];
            let oldPerson = people.filter((oldGroup) => oldGroup.id === newPerson.id)[0];
            if (!oldPerson) {
                throw {
                    message: `Group with id [${newPerson.id}] not found!`,
                    code: 404
                } as ErrorResponse;
            }
            let index = people.indexOf(oldPerson);
            people[index] = newPerson;
            fs.writeFileSync("./data/people.json", JSON.stringify(people));
            return newPerson;
        });
        
        this.server.addRequest(RequestType.DELETE, "removePerson", async (args, body) => {
            let people = JSON.parse(fs.readFileSync("./data/people.json", "utf8")) as Person[];
            let length = people.length;
            people = people.filter((person) => person.id !== +args[0]);
            if (length === people.length) {
                throw {
                    message: `Person with id [${args[0]}] not found!`,
                    code: 404
                } as ErrorResponse;
            }
            fs.writeFileSync("data/people.json", JSON.stringify(people));
            return { message: "OK" };
        });
    }
}