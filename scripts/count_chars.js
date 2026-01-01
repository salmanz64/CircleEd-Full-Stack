const fs = require('fs');
const p = fs.readFileSync('d:/GitHub Desktop/CircleEd-Full-Stack/frontend/app/(dashboard)/settings/page.tsx', 'utf8');
console.log('lines', p.split(/\r?\n/).length);
for (const ch of '(){}<>') console.log(ch, p.split(ch).length - 1);
