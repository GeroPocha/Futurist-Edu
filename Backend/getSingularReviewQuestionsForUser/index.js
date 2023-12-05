const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    try {
        await sql.connect(dbConfig);
        const questionQuery = `
            SELECT TOP 1 q.QuestionID, q.Content, c.Name AS CourseName
            FROM Questions q
            INNER JOIN CourseQuestions cq ON q.QuestionID = cq.QuestionID
            INNER JOIN Courses c ON cq.CourseID = c.CourseID
            LEFT JOIN ProgressTracking pt ON q.QuestionID = pt.QuestionID AND pt.UserID = ${userId}
            WHERE cq.CourseID = ${courseId} AND (pt.ReviewCount = 0 OR pt.NextReviewDate <= GETDATE() OR pt.NextReviewDate IS NULL)
            ORDER BY NEWID()`;

        const questionResult = await sql.query(questionQuery);
        
        const countQuery = `
            SELECT COUNT(q.QuestionID) AS OpenQuestionCount
            FROM Questions q
            INNER JOIN CourseQuestions cq ON q.QuestionID = cq.QuestionID
            LEFT JOIN ProgressTracking pt ON q.QuestionID = pt.QuestionID AND pt.UserID = ${userId}
            WHERE cq.CourseID = ${courseId} AND (pt.ReviewCount = 0 OR pt.NextReviewDate <= GETDATE() OR pt.NextReviewDate IS NULL)`;

        const countResult = await sql.query(countQuery);

        context.res = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                question: questionResult.recordset.length > 0 ? questionResult.recordset[0] : null,
                openQuestionCount: countResult.recordset.length > 0 ? countResult.recordset[0].OpenQuestionCount : 0
            })
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