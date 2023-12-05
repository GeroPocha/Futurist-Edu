const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;

    try {
        await sql.connect(dbConfig);
        const query = `
            WITH RecentAnswers AS (
                SELECT 
                    cq.QuestionID,
                    ua.IsCorrect
                FROM 
                    CourseQuestions cq
                INNER JOIN 
                    UserAnswers ua ON cq.QuestionID = ua.QuestionID
                WHERE 
                    cq.CourseID = ${courseId}
                    AND ua.AnsweredAt >= DATEADD(day, -6, GETDATE())
            ),
            AnswerStats AS (
                SELECT 
                    QuestionID,
                    CAST(SUM(CASE WHEN IsCorrect = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 AS SuccessRate
                FROM 
                    RecentAnswers
                GROUP BY 
                    QuestionID
            )
            SELECT 
                qs.QuestionID,
                qs.Content AS Question,
                ans.Content AS Answer,
                ISNULL(asr.SuccessRate, 0) AS SuccessRate
            FROM 
                Questions qs
            LEFT JOIN 
                AnswerStats asr ON qs.QuestionID = asr.QuestionID
            LEFT JOIN 
                Answers ans ON qs.QuestionID = ans.QuestionID
            WHERE
                EXISTS (
                    SELECT 1
                    FROM CourseQuestions cq
                    WHERE cq.QuestionID = qs.QuestionID AND cq.CourseID = ${courseId}
                )
            ORDER BY 
                SuccessRate DESC, qs.QuestionID`;

        const result = await sql.query(query);

        const formattedResults = result.recordset.map(item => ({
            QuestionID: item.QuestionID,
            Question: item.Question,
            Answer: item.Answer,
            SuccessRate: item.SuccessRate.toFixed(2)
        }));

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
