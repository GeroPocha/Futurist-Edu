const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = context.bindingData.userId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT * FROM Users WHERE UserID = ${userId}`;

        if (result.recordset.length > 0) {
            context.res = {
                body: result.recordset[0]
            };
        } else {
            context.res = {
                status: 404,
                body: "User not found"
            };
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
