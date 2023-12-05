const sql = require('mssql');
const dbConfig = require('../shared/db.js');
const trackProgress = require('../shared/trackProgress.js');
const { validateAnswer } = require('./validateAnswer.js'); // Importing the validateAnswer function

module.exports = async function (context, req) {
    const answerData = req.body;

    // Check if all required data is present
    if (!answerData || !answerData.QuestionID || !answerData.UserID || !answerData.AnswerGiven) {
        context.res = {
            status: 400,
            body: "Please ensure all required fields (QuestionID, UserID, AnswerGiven) are present."
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        const questionResult = await sql.query`SELECT Content FROM Questions WHERE QuestionID = ${answerData.QuestionID}`;
        const answerResult = await sql.query`SELECT Content FROM Answers WHERE QuestionID = ${answerData.QuestionID}`;

        const question = questionResult.recordset.length > 0 ? questionResult.recordset[0].Content : null;

        const correctAnswer = answerResult.recordset.length > 0 ? answerResult.recordset[0].Content : null;
        let isCorrect = false;

        // Check if the given answer is the same as the correct answer
        if (answerData.AnswerGiven === correctAnswer) {
            isCorrect = true;
        } else {
            isCorrect = await validateAnswer(question, correctAnswer, answerData.AnswerGiven);
        }

        // Save the user's answer and correctness status
        await sql.query`
            INSERT INTO UserAnswers (QuestionID, UserID, AnswerGiven, IsCorrect)
            VALUES (${answerData.QuestionID}, ${answerData.UserID}, ${answerData.AnswerGiven}, ${isCorrect})`;

            const progressUpdateResult = await trackProgress({
                UserID: answerData.UserID, 
                QuestionID: answerData.QuestionID,
                IsCorrect: isCorrect 
            });
        
        context.res = {
            body: {
                correctness: isCorrect ? "Correct Answer" : "Incorrect Answer",
                correctAnswer: correctAnswer,
                progressUpdate: progressUpdateResult
            }
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
