const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = req.params.courseId;

    if (!courseId) {
        context.res = {
            status: 400,
            body: "Please provide a course ID."
        };
        return;
    }

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                cq.QuestionID,
                COUNT(ua.QuestionID) AS TotalAnswers,
                SUM(CASE WHEN ua.IsCorrect = 1 THEN 1 ELSE 0 END) AS CorrectAnswers,
                CAST(SUM(CASE WHEN ua.IsCorrect = 1 THEN 1 ELSE 0 END) AS float) 
                / NULLIF(COUNT(ua.QuestionID), 0) * 100 AS PercentageCorrect
            FROM 
                CourseQuestions cq
            LEFT JOIN 
                UserAnswers ua ON cq.QuestionID = ua.QuestionID AND ua.IsCorrect = 1
            WHERE 
                cq.CourseID = ${courseId}
            GROUP BY 
                cq.QuestionID
            ORDER BY 
                cq.QuestionID`;

        context.res = {
            body: result.recordset.map(q => ({
                ...q,
                PercentageCorrect: q.PercentageCorrect ? q.PercentageCorrect.toFixed(2) + '%' : '0%'
            }))
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
