const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = context.bindingData.userId;
    const courseId = context.bindingData.courseId;
    const days = context.bindingData.days;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                COUNT(*) AS AnswerCount, 
                CAST(AnsweredAt AS DATE) AS Date
            FROM 
                UserAnswers 
            INNER JOIN 
                CourseQuestions ON UserAnswers.QuestionID = CourseQuestions.QuestionID
            WHERE 
                UserAnswers.UserID = ${userId} 
                AND CourseQuestions.CourseID = ${courseId}
                AND UserAnswers.AnsweredAt >= DATEADD(day, -${days}, GETDATE())
            GROUP BY 
                CAST(AnsweredAt AS DATE)`;

        const formattedResults = result.recordset.map(item => ({
            AnswerCount: item.AnswerCount,
            Date: item.Date.toISOString().split('T')[0] // Converts the date to an ISO string and removes the time
        }))

        context.res = {
            body: formattedResults
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
