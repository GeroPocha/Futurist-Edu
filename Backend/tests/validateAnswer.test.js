const { validateAnswer } = require('../submitUserAnswer/validateAnswer');

describe('validateAnswer', () => {
    it('should return true if user answer is correct', async () => {
        const question = 'What is the capital of France?';
        const correctAnswer = 'Paris';
        const userAnswer = 'Paris';
        const result = await validateAnswer(question, correctAnswer, userAnswer);
        expect(result).toBe(true);
    });

    it('should return false if user answer is incorrect', async () => {
        const question = 'What is the capital of France?';
        const correctAnswer = 'Paris';
        const userAnswer = 'London';
        const result = await validateAnswer(question, correctAnswer, userAnswer);
        expect(result).toBe(false);
    });

    it('should return true if answer is correct but additional formulations are in place', async () => {
        const question = 'What is the capital of France?';
        const correctAnswer = 'Paris';
        const userAnswer = 'It is the city of Paris';
        const result = await validateAnswer(question, correctAnswer, userAnswer);
        expect(result).toBe(true);
    });

    it('should return false if there is a list of possible answers provided', async () => {
        const question = 'What is the capital of France?';
        const correctAnswer = 'Paris';
        const userAnswer = 'Its either Paris, Athens, New York or Los Angeles';
        const result = await validateAnswer(question, correctAnswer, userAnswer);
        expect(result).toBe(false);
    });
});
