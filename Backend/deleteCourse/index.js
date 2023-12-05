const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;

    try {
        await sql.connect(dbConfig);

        await sql.query`DELETE FROM CourseEnrollments WHERE CourseID = ${courseId}`;

        await sql.query`DELETE FROM CourseQuestions WHERE CourseID = ${courseId}`;

        await sql.query`DELETE FROM Courses WHERE CourseID = ${courseId}`;

        context.res = {
            body: "Course and associated enrollments successfully deleted"
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
