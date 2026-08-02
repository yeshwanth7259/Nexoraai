const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const apiKey = envConfig.GOOGLE_GENERATIVE_AI_API_KEY || envConfig.GEMINI_API_KEY;

if (!apiKey) {
  console.log("No API key found in .env.local");
  process.exit(1);
}

fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey)
  .then(r => r.json())
  .then(data => {
    if (data.error) {
      console.log("API Error:", data.error);
    } else {
      const models = data.models.map(m => m.name);
      console.log("Available Models:");
      console.log(models);
    }
  })
  .catch(err => console.error(err));
