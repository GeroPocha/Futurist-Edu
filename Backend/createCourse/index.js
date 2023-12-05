const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const name = req.body.name;
    const createdBy = req.body.user;
    const subject = req.body.subject;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            INSERT INTO Courses (Name, CreatedBy, Subject)
            VALUES (${name}, ${createdBy}, ${subject})`;

        context.res = {
            // status: 201, /* Status for created resource */
            body: "Course successfully created"
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
