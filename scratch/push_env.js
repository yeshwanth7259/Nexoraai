const fs = require('fs');
const { execSync } = require('child_process');

function run() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const lines = envFile.split('\n');

  for (const line of lines) {
    if (!line || line.trim() === '' || line.startsWith('#')) continue;
    
    const splitIndex = line.indexOf('=');
    if (splitIndex === -1) continue;

    const key = line.substring(0, splitIndex).trim();
    const value = line.substring(splitIndex + 1).trim();

    if (!key || !value) continue;

    console.log(`Adding ${key}...`);
    try {
      execSync(`npx vercel env add ${key} production,preview,development --value "${value}" --no-sensitive --yes`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Failed to add ${key}`);
      // If it exists and --yes doesn't overwrite, we might need to remove it first.
      try {
        console.log(`Trying to remove existing ${key} first...`);
        execSync(`npx vercel env rm ${key} production,preview,development --yes`, { stdio: 'ignore' });
        execSync(`npx vercel env add ${key} production,preview,development --value "${value}" --no-sensitive --yes`, { stdio: 'inherit' });
      } catch (err2) {
        console.error(`Could not add ${key} even after trying to remove it.`);
      }
    }
  }
}

run();
