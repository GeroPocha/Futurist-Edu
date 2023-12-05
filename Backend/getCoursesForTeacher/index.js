const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = context.bindingData.userId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                c.CourseID, 
                c.Name, 
                c.Subject,
                COUNT(ce.UserID) AS EnrolledStudents,
                CONVERT(VARCHAR(10), c.CreatedAt, 120) AS CreatedDate  -- Konvertiert das Datum ins Format 'YYYY-MM-DD'
            FROM 
                Courses c
            LEFT JOIN 
                CourseEnrollments ce ON c.CourseID = ce.CourseID
            WHERE 
                c.CreatedBy = ${userId}
            GROUP BY 
                c.CourseID, c.Name, c.Subject, c.CreatedAt`;

        context.res = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(result.recordset)
        };
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
