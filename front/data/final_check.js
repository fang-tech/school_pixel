const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let c = fs.readFileSync(path, 'utf8');

if (c.includes('e.value="reset"')) {
    c = c.replace('e.value="reset"', 'e.value="重置"');
}
if (c.includes('value="reset"')) {
    c = c.replace(/value="reset"/g, 'value="重置"');
}

fs.writeFileSync(path, c, 'utf8');
console.log('Final check passed');
