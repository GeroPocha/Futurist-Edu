const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;
    const days = 7; 

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                u.UserID as id, 
                u.Username as name, 
                u.Email as mail, 
                COUNT(ua.QuestionID) as correctAnsweredQuestions
            FROM 
                Users u
            INNER JOIN 
                CourseEnrollments ce ON u.UserID = ce.UserID
            INNER JOIN 
                CourseQuestions cq ON ce.CourseID = cq.CourseID
            LEFT JOIN 
                UserAnswers ua ON cq.QuestionID = ua.QuestionID AND ua.UserID = ce.UserID AND ua.AnsweredAt >= DATEADD(day, -${days} + 1, GETDATE()) AND ua.IsCorrect = 1
            WHERE 
                ce.CourseID = ${courseId}
            GROUP BY 
                u.UserID, u.Username, u.Email
            ORDER BY 
                correctAnsweredQuestions DESC`;

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
