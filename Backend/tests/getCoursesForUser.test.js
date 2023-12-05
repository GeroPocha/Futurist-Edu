const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const getCoursesForUser = require('../getCoursesForUser/index.js');

const context = {
    res: null
};
const req = {
    params: {
        userId: 123  
    }
};

test('should connect to the database', async () => {
    await getCoursesForUser(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return courses for the user', async () => {
    sql.query.mockResolvedValue({
        recordset: [
            { CourseID: 1, Name: 'Advanced Spells', Subject: 'Witchcraft', CreatedBy: 'Albus Dumbledore' },
            { CourseID: 2, Name: 'English 101', Subject: 'English', CreatedBy: 'John Keating' },
        ]
    });

    await getCoursesForUser(context, req);

    expect(context.res.body).toEqual([
        { CourseID: 1, Name: 'Advanced Spells', Subject: 'Witchcraft', CreatedBy: 'Albus Dumbledore' },
        { CourseID: 2, Name: 'English 101', Subject: 'English', CreatedBy: 'John Keating' },
    ]);
});

test('should handle errors', async () => {
    const errorMessage = 'Query execution failed';
    sql.query.mockRejectedValue(new Error(errorMessage));

    await getCoursesForUser(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
