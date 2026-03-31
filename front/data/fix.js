const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('MannequinChar="＃人偶＃"', 'MannequinChar="\\uff03\\u30de\\u30cd\\u30ad\\u30f3\\uff03"');

// Fix the missing translation of 【装飾】 since user screenshots show it in Japanese
content = content.replace(/【装飾】/g, '【装饰】');
content = content.replace(/上着/g, '上衣');
content = content.replace(/ベルト・前掛け/g, '腰带・围裙');
content = content.replace(/服飾/g, '服饰');
content = content.replace(/手 /g, '手部 ');
content = content.replace(/背中 /g, '背部 ');
content = content.replace(/＃マネキン＃/g, '#人偶#');

// Actually wait, let's update the trDict in my injected dictionary just in case
content = content.replace('"靴": "鞋子",', '"靴": "鞋子",\n    "【装飾】上着": "【装饰】外套",\n    "【装飾】ベルト・前掛け": "【装饰】腰带・围裙",\n    "【装飾】服飾": "【装饰】服饰",\n    "【装飾】手": "【装饰】手",\n    "【装飾】背中": "【装饰】背中",\n    "足": "腿",');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed!');
