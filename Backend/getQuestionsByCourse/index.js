const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
  const courseId = req.params.courseId;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT q.* 
      FROM Questions q
      INNER JOIN CourseQuestions cq ON q.QuestionID = cq.QuestionID
      WHERE cq.CourseID = ${courseId}`;

    context.res = {
      body: result.recordset
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: "Error: " + err.message
    };
  }
};
