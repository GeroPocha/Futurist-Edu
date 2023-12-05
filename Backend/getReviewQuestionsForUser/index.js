const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT q.QuestionID, q.Content 
            FROM Questions q
            INNER JOIN CourseQuestions cq ON q.QuestionID = cq.QuestionID
            LEFT JOIN ProgressTracking pt ON q.QuestionID = pt.QuestionID AND pt.UserID = ${userId}
            WHERE cq.CourseID = ${courseId} AND (pt.ReviewCount = 0 OR pt.NextReviewDate <= GETDATE() OR pt.NextReviewDate IS NULL)`;

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
