import * as fs from "fs";

import { Server, RequestType, ErrorResponse } from "node-server";

import { Person } from "./models/person";

let server: Server = new Server("web");

server.addRequest(RequestType.GET, "allPeople", async (args, body) => {
    return JSON.parse(fs.readFileSync("./data/people.json", "utf8"));
});

server.addRequest(RequestType.GET, "person", async (args, body) => {
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

server.addRequest(RequestType.POST, "addPerson", async (args, body) => {
    let person = body as Person;
    let people = JSON.parse(fs.readFileSync("./data/people.json", "utf8")) as Person[];
    person.id = Math.max(...people.map((person) => person.id)) + 1;
    people.push(person);
    fs.writeFileSync("./data/people.json", JSON.stringify(people));
    return person;
});

server.addRequest(RequestType.DELETE, "removePerson", async (args, body) => {
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

server.launchServer();
