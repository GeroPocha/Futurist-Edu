const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const { username, role, email } = req.body;

    if (!username || !role || !email) {
        context.res = {
            status: 400,
            body: "Please provide username, role, and email."
        };
        return;
    }

    try {
        await sql.connect(dbConfig);
        await sql.query`
            INSERT INTO Users (Username, Role, Email) 
            VALUES (${username}, ${role}, ${email})`;

        context.res = {
            body: "User successfully created."
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
