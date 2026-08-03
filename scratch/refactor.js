const fs = require('fs');
const files = [
  'c:/nexoraai/app/(main)/home/page.tsx',
  'c:/nexoraai/app/(main)/studios/app-dev/page.tsx',
  'c:/nexoraai/app/(main)/studios/video/page.tsx',
  'c:/nexoraai/app/(main)/studios/seo/page.tsx',
  'c:/nexoraai/app/(main)/studios/content/page.tsx',
  'c:/nexoraai/app/(main)/studios/resume/page.tsx',
  'c:/nexoraai/app/(main)/studios/ui-ux/page.tsx',
  'c:/nexoraai/components/auth/auth-modal.tsx',
  'c:/nexoraai/components/home/inline-prompt.tsx',
  'c:/nexoraai/components/home/quick-upload-action.tsx'
];

files.forEach(filepath => {
  if (!fs.existsSync(filepath)) return;
  
  let file = fs.readFileSync(filepath, 'utf8');
  
  // Replacements
  file = file.replace(/text-white/g, 'text-foreground');
  file = file.replace(/bg-\[\#0B0B14\]/g, 'bg-background');
  file = file.replace(/bg-\[\#05050A\]/g, 'bg-background');
  file = file.replace(/bg-\[\#12121A\]/g, 'bg-bgDarker');
  file = file.replace(/bg-\[\#09090E\]/g, 'bg-bgDarker');
  file = file.replace(/text-slate-400/g, 'text-textMuted');
  file = file.replace(/text-slate-500/g, 'text-textMuted');
  file = file.replace(/text-slate-300/g, 'text-foreground');
  file = file.replace(/text-slate-200/g, 'text-foreground');
  file = file.replace(/border-white\/5/g, 'border-borders');
  file = file.replace(/border-white\/10/g, 'border-borders');
  file = file.replace(/bg-white\/5/g, 'bg-hoverBg');
  file = file.replace(/hover:bg-white\/5/g, 'hover:bg-hoverBg');
  file = file.replace(/hover:bg-white\/10/g, 'hover:bg-hoverBg');
  file = file.replace(/bg-white\/10/g, 'bg-hoverBg');
  file = file.replace(/bg-[#0A0A0F]/g, 'bg-bgDarker');
  
  fs.writeFileSync(filepath, file);
  console.log('Refactored:', filepath);
});
