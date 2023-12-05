const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js'); 
const getTotalAnswerCountPerCourse = require('../getTotalAnswerCountPerCourse/index');

// Mock context and req
const context = {
    bindingData: {
        courseId: 1,
        days: 7
    },
    res: null
};
const req = {};

test('should connect to the database', async () => {
    await getTotalAnswerCountPerCourse(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});
test('should execute the query and return formatted results', async () => {
    sql.query.mockResolvedValue({
        recordset: [
            { AnswerCount: 10, Date: new Date('2023-11-17') },
            { AnswerCount: 20, Date: new Date('2023-11-16') },
            { AnswerCount: 8, Date: new Date('2023-11-15')  },
            { AnswerCount: 39, Date: new Date('2023-11-14') },
            { AnswerCount: 4, Date: new Date('2023-11-13')  },
            { AnswerCount: 14, Date: new Date('2023-11-12') },
            { AnswerCount: 12, Date: new Date('2023-11-11') }
        ]
    });

    await getTotalAnswerCountPerCourse(context, req);

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
    const errorMessage = 'Database connection failed';
    sql.connect.mockRejectedValue(new Error(errorMessage));

    await getTotalAnswerCountPerCourse(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
