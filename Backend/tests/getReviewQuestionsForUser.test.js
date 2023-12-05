const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const getReviewQuestionsForUser = require('../getReviewQuestionsForUser/index.js');  

const context = {
    res: null
};
const req = {
    params: {
        userId: 23,
        courseId: 34  
    }
};

test('should connect to the database', async () => {
    await getReviewQuestionsForUser(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return questions for review', async () => {
    // Mock the query result
    sql.query.mockResolvedValue({
        recordset: [
            { QuestionID: 1, Content: 'How many points did Giannis Antetokounmpo average in the 2022-2023 Season?' },
            { QuestionID: 2, Content: 'How many ballon dor does Lionel Messi have?' },
            { QuestionID: 3, Content: 'How many netflix shows are there?' },
        ]
    });

    await getReviewQuestionsForUser(context, req);

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

    await getReviewQuestionsForUser(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
