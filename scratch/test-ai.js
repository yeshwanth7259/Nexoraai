const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

async function test() {
  try {
    const { text } = await generateText({
      model: google('gemini-flash-latest'),
      prompt: 'I need to build a eccomerce website for my saree bussiness',
    });
    console.log("TEXT RESPONSE:");
    console.log(text);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
