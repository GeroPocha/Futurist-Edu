const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId; 

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT COUNT(*) AS StudentCount
            FROM CourseEnrollments
            WHERE CourseID = ${courseId}`;

        context.res = {
            body: {
                courseId: courseId,
                studentCount: result.recordset[0].StudentCount
            }
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
