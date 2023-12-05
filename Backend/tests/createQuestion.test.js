const createQuestion = require('../createQuestion/index');
const sql = require('mssql');
jest.mock('mssql');

describe('Function Test', () => {
  beforeEach(() => {
    // Reset mocks before each test
    sql.connect.mockClear();
    sql.query.mockClear();
  });

  it('should return an error when required fields are missing', async () => {
    const context = { res: {} };
    const req = { body: { Content: 'Sample content' } }; // Incomplete data

    await createQuestion(context, req);

    expect(context.res.status).toBe(400);
  });

  it('should be successful when all data is present', async () => {
    const context = { res: {} };
    const req = { body: { Content: 'Sample content', CreatedBy: 'User', Subject: 'Topic' } };

    sql.query.mockResolvedValue(/* Mocked Database Response */);

    await createQuestion(context, req);

    expect(context.res.body).toBe('Question successfully created.');
  });

  it('should return an error when a database error occurs', async () => {
    const context = { res: {} };
    const req = { body: { Content: 'Sample content', CreatedBy: 'User', Subject: 'Topic' } };

    sql.query.mockRejectedValue(new Error('Database error'));

    await createQuestion(context, req);

    expect(context.res.status).toBe(500);
  });
});
