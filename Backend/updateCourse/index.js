const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = req.body.courseId;
    const name = req.body.name;
    const subject = req.body.subject;

    if (!courseId || !name || !subject) {
        context.res = {
            status: 400,
            body: "Course ID, name, and subject are required."
        };
        return;
    }

    try {
        await sql.connect(dbConfig);
        await sql.query`
            UPDATE Courses 
            SET Name = ${name}, Subject = ${subject}
            WHERE CourseID = ${courseId}`;

        context.res = {
            body: "Course successfully updated"
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};