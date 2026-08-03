const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filepath) {
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;
  
  let original = fs.readFileSync(filepath, 'utf8');
  let file = original;
  
  // Replace dark backgrounds
  file = file.replace(/bg-\[#1e1e1e\]/gi, 'bg-bgDarker');
  file = file.replace(/bg-\[#2d2d2d\]/gi, 'bg-hoverBg');
  
  if (original !== file) {
    fs.writeFileSync(filepath, file);
    console.log('Refactored:', filepath);
  }
}

console.log("Starting global color refactor pass 2...");
walkDir('c:/nexoraai/app', processFile);
walkDir('c:/nexoraai/components', processFile);
console.log("Finished global color refactor pass 2.");
