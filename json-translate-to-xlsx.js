const googleTranslate = require("google-translate-cn-api");
const json2xls = require('json2xls');
var fs = require('fs'); //文件模块

/**
 * 将json翻译成对应语言，并生成xlsx表格
 * 
 * @param {Object} data 需要翻译的内容
 * @param {Array} langs 需要翻译的语言code
 * @param {String} from 初始语言
 * @param {String} domain 谷歌翻译节点
 * @param {String} filePath 翻译出来的表格路径，文件名
 * @param {Function} replaceFn 额外处理翻译出来的内容
 */

async function jsonTranslateToXlsx({
  data, 
  langs, 
  from = 'en', 
  domain = 'com',
  filePath = 'xlsx.xlsx',
  replaceFn
}) {
  try {
    let res = []
    for (let item in data) {
      const promise = []
      for (let i = 0, len = langs.length; i < len; i++) {
        const lang = langs[i]
        promise.push(googleTranslate(data[item], { to: lang, from, raw: true, domain }))
      }

      const r = await Promise.all(promise)
      res.push(r)
    }

    const a = Object.keys(data)
    const table = []
    for (let i = 0, len = a.length; i < len; i++) {
      for (let j = 0, l = langs.length; j < l; j++) {
        if (!table[i]) table[i] = {
          code: a[i]
        }
        let lang = langs[j]
        table[i][lang] = replaceFn ? replaceFn(res[i][j].text) : res[i][j].text
      }
    }
    let xls = json2xls(table);
    fs.writeFileSync(filePath, xls, 'binary');
  } catch (error) {
    return error
  }
}

module.exports = {
  jsonTranslateToXlsx
}