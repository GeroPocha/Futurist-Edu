const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                u.UserID,
                u.Username,
                CASE 
                    WHEN ce.CourseID IS NOT NULL THEN 'true' 
                    ELSE 'false' 
                END AS IsEnrolled
            FROM 
                Users u
            LEFT JOIN 
                CourseEnrollments ce ON u.UserID = ce.UserID AND ce.CourseID = ${courseId}
            WHERE 
                u.Role = 'Student'`;

        context.res = {
            body: result.recordset
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
