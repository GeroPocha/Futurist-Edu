const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = req.params.userId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT c.CourseID, c.Name, c.Subject, c.CreatedBy
            FROM Courses c
            INNER JOIN CourseEnrollments ce ON c.CourseID = ce.CourseID
            WHERE ce.UserID = ${userId}`;

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: result.recordset
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
