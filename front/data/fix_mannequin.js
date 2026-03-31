const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let content = fs.readFileSync(path, 'utf8');

// Use string literals carefully
content = content.replace('MannequinChar="\\\\uff03\\\\u30de\\\\u30cd\\\\u30ad\\\\u30f3\\\\uff03"', 'MannequinChar="\\uff03\\u30de\\u30cd\\u30ad\\u30f3\\uff03"');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed mannequin string!');
