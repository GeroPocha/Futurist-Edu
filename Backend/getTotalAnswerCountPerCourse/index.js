const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;
    const days = parseInt(context.bindingData.days); // Assume 'days' is the number of days including today

    try {
        await sql.connect(dbConfig);

        const query = `
            WITH DateRange(Date) AS (
                SELECT TOP (${days})
                    CAST(DATEADD(day, -ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 1, GETDATE()) AS DATE) AS Date
                FROM 
                    sys.objects
            )
            SELECT 
                d.Date,
                ISNULL(a.AnswerCount, 0) AS AnswerCount,
                ISNULL(c.CorrectAnswerCount, 0) AS CorrectAnswerCount
            FROM 
                DateRange d
            LEFT JOIN (
                SELECT 
                    COUNT(*) AS AnswerCount, 
                    CAST(AnsweredAt AS DATE) AS Date
                FROM 
                    UserAnswers 
                INNER JOIN 
                    CourseQuestions ON UserAnswers.QuestionID = CourseQuestions.QuestionID
                WHERE 
                    CourseQuestions.CourseID = ${courseId}
                    AND UserAnswers.AnsweredAt >= DATEADD(day, -${days} + 1, GETDATE())
                GROUP BY 
                    CAST(AnsweredAt AS DATE)
            ) a ON d.Date = a.Date
            LEFT JOIN (
                SELECT 
                    COUNT(*) AS CorrectAnswerCount, 
                    CAST(AnsweredAt AS DATE) AS Date
                FROM 
                    UserAnswers 
                INNER JOIN 
                    CourseQuestions ON UserAnswers.QuestionID = CourseQuestions.QuestionID
                WHERE 
                    CourseQuestions.CourseID = ${courseId}
                    AND UserAnswers.AnsweredAt >= DATEADD(day, -${days} + 1, GETDATE())
                    AND UserAnswers.IsCorrect = 1
                GROUP BY 
                    CAST(AnsweredAt AS DATE)
            ) c ON d.Date = c.Date
            ORDER BY 
                d.Date DESC`;

        const result = await sql.query(query);

        const formattedResults = result.recordset.map(item => ({
            Date: new Date(item.Date).toLocaleDateString('en-US', {
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit'
            }),
            AnswerCount: item.AnswerCount,
            CorrectAnswerCount: item.CorrectAnswerCount
        }));
        

        context.res = {
            // Sends the formatted result
            body: formattedResults
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
