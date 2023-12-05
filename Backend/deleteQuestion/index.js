const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const questionId = context.bindingData.questionId;

    try {
        await sql.connect(dbConfig);
        const transaction = new sql.Transaction();
        await transaction.begin();

        const deleteCourseQuestions = new sql.Request(transaction);
        await deleteCourseQuestions.query`
            DELETE FROM CourseQuestions
            WHERE QuestionID = ${questionId}`;

        const deleteQuestion = new sql.Request(transaction);
        await deleteQuestion.query`
            DELETE FROM Questions
            WHERE QuestionID = ${questionId}`;

        await transaction.commit();

        context.res = {
            body: "Question and associated course question entries successfully deleted"
        };
    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
