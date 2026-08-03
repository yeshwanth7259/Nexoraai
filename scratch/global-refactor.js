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
  file = file.replace(/bg-\[#0B0B14\]/g, 'bg-background');
  file = file.replace(/bg-\[#05050A\]/g, 'bg-background');
  file = file.replace(/bg-\[#12121A\]/g, 'bg-bgDarker');
  file = file.replace(/bg-\[#09090E\]/g, 'bg-bgDarker');
  file = file.replace(/bg-\[#1A1A24\]/g, 'bg-hoverBg');
  file = file.replace(/bg-\[#0b0f24\](?:\/[0-9]+)?/g, 'bg-background');
  file = file.replace(/bg-\[#060816\](?:\/[0-9]+)?/g, 'bg-background');
  file = file.replace(/bg-\[#212121\]/g, 'bg-bgDarker');
  file = file.replace(/bg-\[#2d2d2d\]/g, 'bg-hoverBg');
  
  // Replace borders
  file = file.replace(/border-white\/5/g, 'border-borders');
  file = file.replace(/border-white\/10/g, 'border-borders');
  file = file.replace(/border-white\/20/g, 'border-borders');
  file = file.replace(/border-\[#333\]/g, 'border-borders');
  
  // Replace text colors
  file = file.replace(/text-slate-400/g, 'text-textMuted');
  file = file.replace(/text-slate-500/g, 'text-textMuted');
  file = file.replace(/text-slate-300/g, 'text-textMuted');
  file = file.replace(/text-slate-200/g, 'text-foreground');
  file = file.replace(/text-white\/60/g, 'text-textMuted');
  file = file.replace(/text-white\/80/g, 'text-foreground');
  
  // Replace hover states
  file = file.replace(/hover:bg-\[#1A1A24\]/g, 'hover:bg-hoverBg');
  file = file.replace(/hover:bg-\[#12121A\]/g, 'hover:bg-hoverBg');
  file = file.replace(/hover:border-white\/20/g, 'hover:border-primary/50');
  
  if (original !== file) {
    fs.writeFileSync(filepath, file);
    console.log('Refactored:', filepath);
  }
}

console.log("Starting global color refactor...");
walkDir('c:/nexoraai/app', processFile);
walkDir('c:/nexoraai/components', processFile);
console.log("Finished global color refactor.");
