const OpenAI = require('openai');
const openAiConfig = require('../shared/openAiConfig.js');

const openai = new OpenAI({ apiKey: openAiConfig.openAiDevKey });

async function createQuestionsFromText(inputText, level) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an AI used in Education. Your task is to generate ${level} question and answer pairs based on the provided text. Do not include information outside of the text. Please provide these pairs in a clear and concise format.`
      },
      {
        role: "user",
        content: `Here is the text: '${inputText}'`
      }
    ],
    model: "gpt-4-1106-preview",
  });

  const output = completion.choices[0].message.content;
  const lines = output.split('\n');

  const questionAnswerPairs = [];
  let currentQuestion = '';
  let currentAnswer = '';

  lines.forEach(line => {
    if (line.startsWith('Q')) {
      if (currentQuestion && currentAnswer) {
        questionAnswerPairs.push({ question: currentQuestion, answer: currentAnswer });
        currentAnswer = '';
      }
      currentQuestion = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('A')) {
      currentAnswer = line.substring(line.indexOf(':') + 1).trim();
    }
  });

  // Add the last pair if exists
  if (currentQuestion && currentAnswer) {
    questionAnswerPairs.push({ question: currentQuestion, answer: currentAnswer });
  }

  return questionAnswerPairs;
}

module.exports = createQuestionsFromText;
