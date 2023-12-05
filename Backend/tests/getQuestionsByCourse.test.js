const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const getQuestionsByCourse = require('../getQuestionsByCourse/index.js');

const context = {
    res: null
};
const req = {
    params: {
        courseId: 456
    }
};

test('should connect to the database', async () => {
    await getQuestionsByCourse(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return all questions for the course', async () => {
    // Mock the query result
    sql.query.mockResolvedValue({
        recordset: [
            { QuestionID: 1, Content: 'How many points did Giannis Antetokounmpo average in the 2022-2023 Season?' },
            { QuestionID: 2, Content: 'How many ballon dor does Lionel Messi have?' },
            { QuestionID: 3, Content: 'How many netflix shows are there?' },
        ]
    });

    await getQuestionsByCourse(context, req);

    // Check if the result is as expected
    expect(context.res.body).toEqual([
        { QuestionID: 1, Content: 'How many points did Giannis Antetokounmpo average in the 2022-2023 Season?' },
        { QuestionID: 2, Content: 'How many ballon dor does Lionel Messi have?' },
        { QuestionID: 3, Content: 'How many netflix shows are there?' },
    ]);
});

test('should handle errors', async () => {
    const errorMessage = 'Query execution failed';
    sql.query.mockRejectedValue(new Error(errorMessage));

    await getQuestionsByCourse(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
