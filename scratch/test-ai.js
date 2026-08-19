const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

async function test() {
  try {
    const { text } = await generateText({
      model: google('gemini-flash-latest'),
      prompt: 'hi',
    });
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}

test();
