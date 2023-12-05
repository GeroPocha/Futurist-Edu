const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = req.params.courseId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT q.QuestionID, q.Content AS QuestionContent, a.AnswerID, a.Content AS AnswerContent
            FROM Questions q
            INNER JOIN CourseQuestions cq ON q.QuestionID = cq.QuestionID
            LEFT JOIN Answers a ON q.QuestionID = a.QuestionID
            WHERE cq.CourseID = ${courseId}`;

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
