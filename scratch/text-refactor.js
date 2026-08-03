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
  
  // Targeted replaces for headings and layout wrappers
  file = file.replace(/text-white pb-12/g, 'text-foreground pb-12');
  file = file.replace(/text-white mb-3/g, 'text-foreground mb-3');
  file = file.replace(/text-white mb-4/g, 'text-foreground mb-4');
  file = file.replace(/text-white mb-6/g, 'text-foreground mb-6');
  file = file.replace(/text-white mb-2/g, 'text-foreground mb-2');
  file = file.replace(/text-white mb-1/g, 'text-foreground mb-1');
  file = file.replace(/text-white mb-0\.5/g, 'text-foreground mb-0.5');
  file = file.replace(/text-white capitalize/g, 'text-foreground capitalize');
  file = file.replace(/text-2xl font-bold text-white/g, 'text-2xl font-bold text-foreground');
  file = file.replace(/text-3xl font-bold text-white/g, 'text-3xl font-bold text-foreground');
  file = file.replace(/text-xl font-bold text-white/g, 'text-xl font-bold text-foreground');
  file = file.replace(/text-lg font-semibold text-white/g, 'text-lg font-semibold text-foreground');
  file = file.replace(/text-white drop-shadow-md/g, 'text-foreground drop-shadow-md');
  file = file.replace(/font-bold text-white/g, 'font-bold text-foreground');
  
  // Inputs
  file = file.replace(/outline-none text-white/g, 'outline-none text-foreground');
  file = file.replace(/placeholder:text-textMuted text-white/g, 'placeholder:text-textMuted text-foreground');
  file = file.replace(/text-sm text-white outline-none/g, 'text-sm text-foreground outline-none');
  file = file.replace(/text-white focus:ring-0/g, 'text-foreground focus:ring-0');
  file = file.replace(/text-white text-lg/g, 'text-foreground text-lg');
  file = file.replace(/text-white focus:outline-none/g, 'text-foreground focus:outline-none');
  
  // Hovers and spans
  file = file.replace(/hover:text-white/g, 'hover:text-foreground');
  file = file.replace(/group-hover:text-white/g, 'group-hover:text-foreground');
  
  // Fix hoverBg
  file = file.replace(/hover:bg-white\/5/g, 'hover:bg-hoverBg');
  file = file.replace(/hover:bg-white\/10/g, 'hover:bg-hoverBg');
  file = file.replace(/bg-white\/5/g, 'bg-hoverBg');
  
  // Fix borders
  file = file.replace(/border-white\/10/g, 'border-borders');
  
  // Avoid replacing bg-primary text-white
  // Wait, I replaced hover:text-white, but what if it's on a button? Usually buttons have fixed text colors.
  
  if (original !== file) {
    fs.writeFileSync(filepath, file);
    console.log('Refactored:', filepath);
  }
}

console.log("Starting text-white refactor...");
walkDir('c:/nexoraai/app', processFile);
walkDir('c:/nexoraai/components', processFile);
console.log("Finished text-white refactor.");
