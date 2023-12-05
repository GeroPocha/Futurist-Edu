const mssql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const storeCourseQuestions = require('../storeCourseQuestions/index.js');

const context = {
    log: jest.fn(),
    res: null
};
let req = {
    body: {
        courseId: 123,
        createdBy: 'teacher1',
        questionsAndAnswers: [
            { question: 'What is ...?', answer: 'Answer 1' },
            { question: 'How does ... work?', answer: 'Answer 2' }
            // ... other mock data
        ]
    }
};

test('should connect to the database', async () => {
    await storeCourseQuestions(context, req);
    expect(mssql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should insert questions and answers successfully', async () => {
    // Mock SQL query responses
    mssql.query.mockResolvedValueOnce({ recordset: [{ QuestionID: 1 }] });
    mssql.query.mockResolvedValueOnce({}); // Mock insert answer response
    mssql.query.mockResolvedValueOnce({}); // Mock insert course question link response
    mssql.query.mockResolvedValueOnce({ recordset: [{ QuestionID: 2 }] });
    // Add more mocks as needed for each question-answer pair

    await storeCourseQuestions(context, req);

    // Check if the response is as expected
    expect(context.res).toEqual({
        status: 200,
        body: "Questions and answers have been stored successfully."
    });
});

test('should handle errors during insertion', async () => {
    const errorMessage = 'Database insertion failed';
    mssql.query.mockRejectedValue(new Error(errorMessage));

    await storeCourseQuestions(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error while inserting questions and answers: Error: " + errorMessage
    });
});


