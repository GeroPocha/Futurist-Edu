const sql = require('mssql');
const dbConfig = require('../shared/db.js');

module.exports = async function (context, req) {
    const userIds = req.body.userIds; // Array of User IDs
    const courseId = req.body.courseId; // Course ID

    if (!userIds || !courseId) {
        context.res = {
            status: 400,
            body: "User IDs and Course ID are required."
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        const params = userIds.map((id, index) => `@userId${index}`);
        const query = `
            DELETE FROM CourseEnrollments 
            WHERE CourseID = @courseId AND UserID NOT IN (${params.join(",")})`;

        const request = new sql.Request();
        request.input('courseId', sql.Int, courseId);
        userIds.forEach((id, index) => {
            request.input(`userId${index}`, sql.Int, id);
        });

        await request.query(query);

        for (let userId of userIds) {
            await sql.query`
                IF NOT EXISTS (
                    SELECT 1 FROM CourseEnrollments 
                    WHERE UserID = ${userId} AND CourseID = ${courseId}
                )
                BEGIN
                    INSERT INTO CourseEnrollments (UserID, CourseID) 
                    VALUES (${userId}, ${courseId})
                END`;
        }

        context.res = {
            body: "Course enrollment updated successfully."
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    }
};
