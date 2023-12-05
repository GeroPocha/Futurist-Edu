const sql = require('mssql');
const dbConfig = require('../shared/db.js');

async function trackProgress(progressData) {
    try {
        await sql.connect(dbConfig);
        
        // Retrieve current progress from the database
        const currentProgress = await sql.query`
            SELECT ReviewCount, LastReviewed 
            FROM ProgressTracking 
            WHERE UserID = ${progressData.UserID} AND QuestionID = ${progressData.QuestionID}`;

        let nextReviewDate = new Date();
        let performanceRating = 0; // Default PerformanceRating for the first run
        let daysToAdd = 0;

        if (currentProgress.recordset.length > 0) {
            const reviewCount = currentProgress.recordset[0].ReviewCount;
            const lastReviewed = currentProgress.recordset[0].LastReviewed;

            // Update logic for NextReviewDate and PerformanceRating
            daysToAdd = progressData.IsCorrect ? Math.pow(2, reviewCount) : 1;
            nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
            performanceRating = progressData.IsCorrect ? reviewCount + 1 : Math.max(0, reviewCount - 1);

            // Update the database with the new progress
            await sql.query`
                UPDATE ProgressTracking 
                SET LastReviewed = GETDATE(), ReviewCount = ReviewCount + 1, NextReviewDate = ${nextReviewDate}, PerformanceRating = ${performanceRating}
                WHERE UserID = ${progressData.UserID} AND QuestionID = ${progressData.QuestionID}`;
        } else {
            if(progressData.IsCorrect) daysToAdd = 1;
            nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
            await sql.query`
                INSERT INTO ProgressTracking (UserID, QuestionID, LastReviewed, ReviewCount, NextReviewDate, PerformanceRating) 
                VALUES (${progressData.UserID}, ${progressData.QuestionID}, GETDATE(), 1, ${nextReviewDate}, ${performanceRating})`;
        }

        return "Progress successfully updated.";
    } catch (err) {
        throw new Error("Error updating progress: " + err);
    }
}

module.exports = trackProgress;
