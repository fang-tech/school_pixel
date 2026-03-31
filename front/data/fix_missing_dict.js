const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(
    /"身体装飾":"身体装饰" \};/g, 
    '"身体装飾":"身体装饰", "セット服":"套装", "【装飾】頭":"【装饰】头部", "【装飾】顔":"【装饰】面部", "顔・頭装飾":"脸・头部装饰", "頭装飾":"头部装饰", "顔装飾":"面部装饰" };'
);

fs.writeFileSync(path, c, 'utf8');
console.log('Added new translations!');
