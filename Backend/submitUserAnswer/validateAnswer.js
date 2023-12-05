// Importing required modules
const OpenAI = require('openai');
const openAiConfig = require('../shared/openAiConfig.js');

// Initializing the OpenAI client
const openai = new OpenAI({ apiKey: openAiConfig.openAiDevKey });

async function getOpenAIResponse(question, correctAnswer, userAnswer) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI used in Education. Return the answer in a json format" },
      { role: "user", content: `You are a test evaluation system. I will provide you with a question and two answers. You need to assess whether the answers mean the same thing. Answer 1 is the intended answer, while Answer 2 is what the user submits. You can only respond with 'Yes' for the same and 'No' for different. Again, it's not about whether they are phrased the same, but whether Answer 2 conveys the same content as Answer 1. Question: ${question} Answer1: ${correctAnswer} Answer2: ${userAnswer}` }
    ],
    model: "gpt-4-1106-preview",
  });

  return completion.choices[0].message.content.trim();
}

async function validateAnswer(question, correctAnswer, userAnswer) {
  try {
    const aiResponse = await getOpenAIResponse(question, correctAnswer, userAnswer);
    
    // Using regular expressions to check for "Yes" or "No"
    if (/yes/i.test(aiResponse)) {
      return true;
    } else if (/no/i.test(aiResponse)) {
      return false;
    } else {
      throw new Error('Unexpected response from OpenAI: ' + aiResponse);
    }
  } catch (err) {
    console.error('Error in the OpenAI request:', err);
    throw err; // Forwarding the error
  }
}

// Exporting the function
module.exports = { validateAnswer, getOpenAIResponse };
