const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const getCourseQuestionStats = require('../getCourseQuestionStats/index.js');

const context = {
    res: null
};
let req = {
    params: {
        courseId: 123
    }
};

test('should return a 400 status if courseId is not provided', async () => {
    req = { params: {} }; // No courseId provided
    await getCourseQuestionStats(context, req);
    expect(context.res).toEqual({
        status: 400,
        body: "Please provide a course ID."
    });
});

test('should connect to the database', async () => {
    req = { params: { courseId: 123 } }; // Reset to valid request
    await getCourseQuestionStats(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return question statistics for the course', async () => {
    sql.query.mockResolvedValue({
        recordset: [
            { QuestionID: 1, TotalAnswers: 10, CorrectAnswers: 4, PercentageCorrect: 40.0 },
            { QuestionID: 2, TotalAnswers: 10, CorrectAnswers: 9, PercentageCorrect: 90.0 },
            { QuestionID: 3, TotalAnswers: 10, CorrectAnswers: 8, PercentageCorrect: 80.0 }
        ]
    });

    await getCourseQuestionStats(context, req);

    expect(context.res.body).toEqual([
        { QuestionID: 1, TotalAnswers: 10, CorrectAnswers: 4, PercentageCorrect: '40.00%' },
        { QuestionID: 2, TotalAnswers: 10, CorrectAnswers: 9, PercentageCorrect: '90.00%' },
        { QuestionID: 3, TotalAnswers: 10, CorrectAnswers: 8, PercentageCorrect: '80.00%' },
    ]);
});

test('should handle errors', async () => {
    const errorMessage = 'Query execution failed';
    sql.query.mockRejectedValue(new Error(errorMessage));

    await getCourseQuestionStats(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});

