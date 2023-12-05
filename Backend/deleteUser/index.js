const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = context.bindingData.userId;

    try {
        await sql.connect(dbConfig);

        await sql.query`DELETE FROM Answers WHERE QuestionID IN (SELECT QuestionID FROM Questions WHERE CreatedBy = ${userId})`;

        await sql.query`DELETE FROM CourseEnrollments WHERE UserID = ${userId}`;

        await sql.query`DELETE FROM ProgressTracking WHERE UserID = ${userId}`;

        await sql.query`DELETE FROM Questions WHERE CreatedBy = ${userId}`;

        await sql.query`DELETE FROM UserAnswers WHERE UserID = ${userId}`;

        await sql.query`DELETE FROM Users WHERE UserID = ${userId}`;

        context.res = {
            body: "User and all associated data successfully deleted."
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
