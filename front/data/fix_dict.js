const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let content = fs.readFileSync(path, 'utf8');

// The original map didn't get my replacement since I searched for `"靴": "鞋子",` but maybe it was different spacing or quotes. Let's just rip and replace the whole tr function and map.
const newTrLogic = `var trDict={ "ベース":"基础身体", "肌装飾":"面部特征", "右目":"右眼", "左目":"左眼", "前髪":"刘海", "横髪":"侧发", "後ろ髪":"后发", "くせ毛・結び髪":"呆毛/绑发", "動物":"动物耳/尾", "髪装飾":"发饰", "トップス":"上衣", "ボトムス":"下装", "袖":"袖子", "手袋":"手套", "靴下":"袜子", "靴":"鞋子", "背後小物":"背后小物件", "前景小物":"前方小物件", "【装飾】上着":"【装饰】外套", "【装飾】ベルト・前掛け":"【装饰】腰带・围裙", "【装飾】服飾":"【装饰】服饰", "【装飾】手":"【装饰】手", "【装飾】背中":"【装饰】背中", "足":"腿", "身体装飾":"身体装饰" };
function tr(s) { 
  let txt = s.replace(/\\uff08/g, '（').replace(/\\uff09/g, '）').replace(/複数選択可/g, '可多选');
  let raw = txt.replace(/（.*可多选.*）/, '').trim();
  if (trDict[raw]) {
    return trDict[raw] + (txt.includes('可多选') ? ' (可多选)' : '');
  }
  return txt;
}`;

content = content.replace(/var trDict=\{.*?\};\s*function tr\(s\) \{.*?\}/s, newTrLogic);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed full dict');