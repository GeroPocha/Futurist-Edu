const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const courseId = context.bindingData.courseId;
    const days = 7;
    let categories = { ZeroAnswers: 0, OneToNineteenAnswers: 0, TwentyToFiftyAnswers: 0, FiftyPlusAnswers: 0 };

    try {
        await sql.connect(dbConfig);

        const enrolledUsers = await sql.query`
            SELECT UserID 
            FROM CourseEnrollments 
            WHERE CourseID = ${courseId}`;


        for (let user of enrolledUsers.recordset) {
            const answersCountResult = await sql.query`
                SELECT COUNT(*) AS AnswerCount 
                FROM UserAnswers ua
                INNER JOIN CourseQuestions cq ON ua.QuestionID = cq.QuestionID
                WHERE ua.UserID = ${user.UserID} 
                AND ua.AnsweredAt >= DATEADD(day, -${days} + 1, GETDATE())
                AND cq.CourseID = ${courseId}`;

            const answerCount = answersCountResult.recordset[0].AnswerCount;

            if (answerCount >= 50) {
                categories.FiftyPlusAnswers++;
            } else if (answerCount >= 20) {
                categories.TwentyToFiftyAnswers++;
            } else if (answerCount >= 1) {
                categories.OneToNineteenAnswers++;
            } else {
                categories.ZeroAnswers++;
            }
        }

        context.res = {
            body: categories
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
