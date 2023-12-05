const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');  // Adjust the path as needed
const getQuestionsAndAnswersByCourse = require('../getQuestionsAndAnswersByCourse/index.js');  // Adjust the path as needed

const context = {
    res: null
};
const req = {
    params: {
        courseId: 123
    }
};

test('should connect to the database', async () => {
    await getQuestionsAndAnswersByCourse(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return questions and answers for the course', async () => {
    // Mock the query result
    sql.query.mockResolvedValue({
        recordset: [
            { QuestionID: 1, QuestionContent: 'Who won the 2022 FIFA World Cup?', AnswerID: 101, AnswerContent: 'Argentina' },
            { QuestionID: 2, QuestionContent: 'What is the kilowatt equivalent to 10 Horsepower', AnswerID: 102, AnswerContent: '7,35499 kilowatt' },
        ]
    });

    await getQuestionsAndAnswersByCourse(context, req);

    // Check if the result is as expected
    expect(context.res.body).toEqual([
        { QuestionID: 1, QuestionContent: 'Who won the 2022 FIFA World Cup?', AnswerID: 101, AnswerContent: 'Argentina' },
        { QuestionID: 2, QuestionContent: 'What is the kilowatt equivalent to 10 Horsepower', AnswerID: 102, AnswerContent: '7,35499 kilowatt' },
    ]);
});

test('should handle errors', async () => {
    const errorMessage = 'Query execution failed';
    sql.query.mockRejectedValue(new Error(errorMessage));

    await getQuestionsAndAnswersByCourse(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
