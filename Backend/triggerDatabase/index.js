const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    try {
        await sql.connect(dbConfig);
        // Simple Query to activate the DB
        await sql.query`SELECT 1`;

        context.res = {
            body: "DB activated"
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
