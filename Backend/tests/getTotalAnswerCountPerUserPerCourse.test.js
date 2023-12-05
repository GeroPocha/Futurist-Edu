const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const getUserCourseAnswerStats = require('../getTotalAnswerCountPerUserPerCourse/index.js');

const context = {
    bindingData: {
        userId: 123,  // Example user ID
        courseId: 456,  // Example course ID
        days: 7  // Example number of days
    },
    res: null
};
const req = {};

test('should connect to the database', async () => {
    await getUserCourseAnswerStats(context, {});
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return answer counts per day', async () => {
    sql.query.mockResolvedValue({
        recordset: [
            { AnswerCount: 10, Date: new Date('2023-11-17') },
            { AnswerCount: 20, Date: new Date('2023-11-16') },
            { AnswerCount: 8, Date: new Date('2023-11-15') },
            { AnswerCount: 39, Date: new Date('2023-11-14') },
            { AnswerCount: 4, Date: new Date('2023-11-13') },
            { AnswerCount: 14, Date: new Date('2023-11-12') },
            { AnswerCount: 12, Date: new Date('2023-11-11') }
        ]
    });

    await getUserCourseAnswerStats(context, {});

    // Check if the result is as expected
    expect(context.res.body).toEqual([
        { AnswerCount: 10, Date: '2023-11-17' },
        { AnswerCount: 20, Date: '2023-11-16' },
        { AnswerCount: 8, Date: '2023-11-15' },
        { AnswerCount: 39, Date: '2023-11-14' },
        { AnswerCount: 4, Date: '2023-11-13' },
        { AnswerCount: 14, Date: '2023-11-12' },
        { AnswerCount: 12, Date: '2023-11-11' }
    ]);
});

test('should handle errors', async () => {
    const errorMessage = 'Query execution failed';
    sql.query.mockRejectedValue(new Error(errorMessage));

    await getUserCourseAnswerStats(context, {});

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});

