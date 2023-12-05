const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const questionData = req.body;

    // Check if all required data is present
    if (!questionData || !questionData.Content || !questionData.CreatedBy || !questionData.Subject) {
        context.res = {
            status: 400,
            body: "Please make sure all required fields (Content, CreatedBy, Subject) are present."
        };
        return;
    }

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            INSERT INTO Questions (Content, CreatedBy, CreatedAt, Subject)
            VALUES (${questionData.Content}, ${questionData.CreatedBy}, GETDATE(), ${questionData.Subject})`;

        context.res = {
            body: "Question successfully created."
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error creating the question: " + err
        };
    }
};
