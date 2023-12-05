const sql = require('mssql');
const trackProgress = require('../shared/trackProgress');
const validateAnswer = require('../submitUserAnswer/validateAnswer.js');

jest.mock('mssql');
jest.mock('../shared/trackProgress', () => jest.fn());
jest.mock('../submitUserAnswer/validateAnswer.js', () => jest.fn());

const dbConfig = require('../shared/db.js');
const submitUserAnswer = require('../submitUserAnswer/index.js');

const context = {
    res: null
};
let req;

beforeEach(() => {
    req = {
        body: {
            QuestionID: 1,
            UserID: 123,
            AnswerGiven: 'User Answer',
            CourseID: 456 
        }
    };
    context.res = null;
});

test('should return a 400 status if required fields are missing', async () => {
    req.body = {};
    await submitUserAnswer(context, req);
    expect(context.res).toEqual({
        status: 400,
        body: "Please ensure all required fields (QuestionID, UserID, AnswerGiven) are present."
    });
});

test('should process correct answer', async () => {
    sql.connect.mockResolvedValueOnce();
    sql.query.mockResolvedValueOnce({ recordset: [{ Content: 'User Answer' }] }); // Correct answer content
    sql.query.mockResolvedValueOnce({ recordset: [{}] }); // Mock insert answer
    trackProgress.mockResolvedValue('Progress Updated');

    await submitUserAnswer(context, req);

    expect(context.res.body).toBe('Progress Updated');
});

test('should handle errors', async () => {
    const errorMessage = 'Database query failed';
    sql.connect.mockRejectedValueOnce(new Error(errorMessage));

    await submitUserAnswer(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
