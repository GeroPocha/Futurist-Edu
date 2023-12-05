const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userId = context.bindingData.userId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT 
                c.CourseID, 
                c.Name, 
                c.Subject,
                (SELECT COUNT(DISTINCT q.QuestionID)
                 FROM Questions q
                 INNER JOIN CourseQuestions cq ON q.QuestionID = cq.QuestionID
                 LEFT JOIN ProgressTracking pt ON q.QuestionID = pt.QuestionID AND pt.UserID = ${userId}
                 WHERE cq.CourseID = c.CourseID AND (pt.ReviewCount = 0 OR pt.NextReviewDate <= GETDATE() OR pt.NextReviewDate IS NULL)
                ) AS ReviewQuestions
            FROM 
                Courses c
            INNER JOIN 
                CourseEnrollments ce ON c.CourseID = ce.CourseID
            WHERE 
                ce.UserID = ${userId}
            GROUP BY 
                c.CourseID, c.Name, c.Subject`;

        context.res = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: JSON.stringify(result.recordset)
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
