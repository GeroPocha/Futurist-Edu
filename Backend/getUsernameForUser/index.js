const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = context.bindingData.userId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                Username
            FROM 
                Users
            WHERE 
                UserID = ${userId}`;

        if (result.recordset.length > 0) {
            context.res = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', 
                },
                body: JSON.stringify({ username: result.recordset[0].Username })
            };
        } else {
            context.res = {
                status: 404,
                body: "User not found",
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            };
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
};
