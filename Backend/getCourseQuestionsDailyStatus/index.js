const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;

    try {
        await sql.connect(dbConfig);

        const query = `
        WITH DateRange(Date) AS (
            SELECT TOP (7)
                CAST(DATEADD(day, -ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 1, GETDATE()) AS DATE) AS Date
            FROM 
                sys.objects
        )
        SELECT 
            d.Date,
            CASE 
                WHEN cq.Date IS NULL THEN 'No questions created'
                ELSE 'Questions created'
            END AS Status
        FROM 
            DateRange d
        LEFT JOIN (
            SELECT 
                DISTINCT CAST(CreatedAt AS DATE) AS Date
            FROM 
                CourseQuestions
            INNER JOIN 
                Questions ON CourseQuestions.QuestionID = Questions.QuestionID
            WHERE 
                CourseQuestions.CourseID = ${courseId}
                AND CreatedAt >= DATEADD(day, -6, GETDATE())
        ) cq ON d.Date = cq.Date
        ORDER BY 
            d.Date DESC;
        `;

        const result = await sql.query(query);

        const formattedResults = result.recordset.map(item => ({
            Date: new Date(item.Date).toLocaleDateString('en-US', {
                month: '2-digit', 
                day: '2-digit'
            }),
            Status: item.Status
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
