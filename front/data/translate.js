const fs = require('fs');
const path = 'y:/download/ちびコマドット絵作成機_非商用版_ver2.0.0/偪傃僐儅僪僢僩奊嶌惉婡(旕彜梡斉)/data/dotKisekae.js';
let content = fs.readFileSync(path, 'utf8');

// Define dictionary to translate part names
const trDict = {
    "ベース": "基础身体",
    "肌装飾（複数選択可）": "面部特征(可多选)",
    "右目": "右眼",
    "左目": "左眼",
    "前髪": "刘海",
    "横髪": "侧发",
    "後ろ髪": "后发",
    "くせ毛・結び髪（複数選択可）": "呆毛/绑发(可多选)",
    "動物（複数選択可）": "动物耳/尾(可多选)",
    "髪装飾": "发饰",
    "トップス": "上衣",
    "ボトムス": "下装",
    "袖": "袖子",
    "手袋": "手套",
    "靴下": "袜子",
    "靴": "鞋子",
    "背後小物": "背后小物件",
    "前景小物": "前方小物件"
};

// Insert translation function right after require('psd')
content = content.replace("var PSD=require(\"psd\"),root=null,", "var trDict=" + JSON.stringify(trDict) + ";\nfunction tr(s) { return trDict[s] || s.replace(/\\uff08/g, '（').replace(/\\uff09/g, '）').replace(/\\u8907\\u6570\\u9078\\u629e\\u53ef/g, '可多选'); }\nvar PSD=require(\"psd\"),root=null,");

// Translate textContent assignments
content = content.replace('g.textContent=e', 'g.textContent=tr(e)');
content = content.replace('b.textContent=a.name', 'b.textContent=tr(a.name)');
content = content.replace('d.textContent=a.name', 'd.textContent=tr(a.name)');

// Translate "colors" info
content = content.replace('b.textContent=a.length+"colors";', 'b.textContent=a.length+"种颜色";');

// Translate reset
content = content.replace('e.value="reset";', 'e.value="重置";');

// Translate dropdown option
content = content.replace('"\\u8272\\u9078\\u629e"', '"选择颜色"');

// Translate apply button
content = content.replace('"\\u9069\\u7528"', '"应用"');

// Translate sync button
content = content.replace('e+"\\u306e\\u8272\\u306b\\u5408\\u308f\\u305b\\u308b"', '"与" + tr(e) + "保持同色"');

// Translate showName inside paletteTemplate
content = content.replace(/showName:"([^"]+)"/g, function(match, p1) {
    let t = p1;
    t = t.replace("初期色", "默认颜色")
         .replace("美白", "白皙")
         .replace("精悍", "精悍")
         .replace("浅黒", "浅黑")
         .replace("褐色", "褐色")
         .replace("青白", "苍白")
         .replace("黒", "黑色")
         .replace("白", "白色")
         .replace("金", "金色")
         .replace("茶", "棕色")
         .replace("赤", "红色")
         .replace("橙", "橙色")
         .replace("桃", "粉色")
         .replace("紫", "紫色")
         .replace("青", "蓝色")
         .replace("緑", "绿色");
    return 'showName:"' + t + '"';
});

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
