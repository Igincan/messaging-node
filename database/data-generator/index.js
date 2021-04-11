const fs = require("fs");

let out = "";

JSON.parse(fs.readFileSync("./in.json", "utf8")).forEach(person => {
    out += `INSERT INTO PEOPLE (GROUP_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER) VALUES (${person.group_id}, '${person.first_name}', '${person.last_name}', '${person.phone_number}');\n`;
});

fs.writeFileSync("./out.sql", out);