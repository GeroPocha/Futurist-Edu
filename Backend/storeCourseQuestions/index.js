const mssql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request.');

    const { courseId, createdBy, questionsAndAnswers } = req.body;

    try {
        await mssql.connect(dbConfig);

        for (const qa of questionsAndAnswers) {
            // Insert question
            const resultQuestion = await mssql.query`INSERT INTO dbo.Questions (Content, CreatedBy) OUTPUT Inserted.QuestionID VALUES (${qa.question}, ${createdBy});`;
            const questionId = resultQuestion.recordset[0].QuestionID;

            // Insert answer
            await mssql.query`INSERT INTO dbo.Answers (QuestionID, Content) VALUES (${questionId}, ${qa.answer});`;

            if (courseId) {
                // Insert course question link
                await mssql.query`INSERT INTO dbo.CourseQuestions (CourseID, QuestionID) VALUES (${courseId}, ${questionId});`;
            }
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: JSON.stringify({ message: "Questions and answers have been stored successfully." })
        };
        

    } catch (err) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: "Error while inserting questions and answers: " + err
        };
    }
}