const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/MannequinChar=".*?"/, 'MannequinChar="\\uff03\\u30de\\u30cd\\u30ad\\u30f3\\uff03"');

// And remove any other bad instances of translation
// Actually let's check what the user's g.textContent actually says
let m = c.match(/g\.textContent=(.*?);/);
console.log('g.textContent is:', m ? m[1] : 'not found');

fs.writeFileSync(path, c, 'utf8');
