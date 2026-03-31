const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/g\.textContent=\(function\(n\)\{.*?\}\)\(e\)/s, "g.textContent=tr(e)");
c = c.replace(/g\.textContent=e/g, "g.textContent=tr(e)");

// Check if b.textContent translates name
if (!c.includes('b.textContent=tr(a.name)')) {
    c = c.replace(/b\.textContent=a\.name/g, "b.textContent=tr(a.name)");
}

// Make absolutely sure MannequinChar is right
c = c.replace(/MannequinChar=\"(.*?)\"/, 'MannequinChar="\\uff03\\u30de\\u30cd\\u30ad\\u30f3\\uff03"');

// Fix '##人偶##' if I accidentally left it in from fix.js
c = c.replace(/＃人偶＃/g, '\uff03\u30de\u30cd\u30ad\u30f3\uff03');

fs.writeFileSync(path, c, 'utf8');
console.log('Fixed g.textContent');
