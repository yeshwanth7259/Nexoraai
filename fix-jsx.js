const fs = require('fs');
let f = fs.readFileSync('app/(main)/studios/resume/page.tsx', 'utf8');
f = f.split('\\`').join('`').split('\\$').join('$');
fs.writeFileSync('app/(main)/studios/resume/page.tsx', f);
