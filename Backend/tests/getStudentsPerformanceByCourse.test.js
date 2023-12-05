const sql = require('mssql');
jest.mock('mssql');

const dbConfig = require('../shared/db.js');
const getStudentsPerformanceByCourse = require('../getStudentsPerformanceByCourse/index.js');

const context = {
    bindingData: {
        courseId: 1  
    },
    res: null  
};
const req = {};

test('should connect to the database', async () => {
    await getStudentsPerformanceByCourse(context, req);
    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
});

test('should execute the query and return user performance ratings', async () => {
    // Mock the query result
    sql.query.mockResolvedValue({
        recordset: [
            { Username: 'McGrady1', AverageRating: 6.5 },
            { Username: 'MosesMalone2', AverageRating: 8.8 },
            { Username: 'CP3', AverageRating: 1.5 },
            { Username: 'BillRussel6', AverageRating: 3.8 },
            { Username: 'Mamba8', AverageRating: 2.4 },
            { Username: 'WiltC13', AverageRating: 8.9 },
            { Username: 'Airness23', AverageRating: 9.9 }
        ]
    });

    await getStudentsPerformanceByCourse(context, req);

    // Check if the result is as expected
    expect(context.res.body).toEqual([
        { Username: 'McGrady1', AverageRating: 6.5 },
            { Username: 'MosesMalone2', AverageRating: 8.8 },
            { Username: 'CP3', AverageRating: 1.5 },
            { Username: 'BillRussel6', AverageRating: 3.8 },
            { Username: 'Mamba8', AverageRating: 2.4 },
            { Username: 'WiltC13', AverageRating: 8.9 },
            { Username: 'Airness23', AverageRating: 9.9 }
    ]);
});

test('should handle errors', async () => {
    const errorMessage = 'Query execution failed';
    sql.query.mockRejectedValue(new Error(errorMessage));

    await getStudentsPerformanceByCourse(context, req);

    expect(context.res).toEqual({
        status: 500,
        body: "Error: " + errorMessage
    });
});
