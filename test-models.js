const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const apiKey = envConfig.GOOGLE_GENERATIVE_AI_API_KEY || envConfig.GEMINI_API_KEY;

if (!apiKey) {
  console.log("No API key found in .env.local");
  process.exit(1);
}

const modelsToTest = [
  'gemini-2.0-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemma-4-26b-a4b-it'
];

async function testModel(modelName) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    const data = await response.json();
    if (data.error) {
      console.log(`[FAILED] ${modelName}: ${data.error.message}`);
      return false;
    } else {
      console.log(`[SUCCESS] ${modelName}: Works perfectly!`);
      return true;
    }
  } catch(e) {
    console.log(`[ERROR] ${modelName}: ${e.message}`);
    return false;
  }
}

async function runTests() {
  for (const model of modelsToTest) {
    await testModel(model);
  }
}

runTests();
