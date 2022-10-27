const fs = require("fs");

/**
 * 将多语言xlsx文件转为json，并生成在指定目录
 * @param {*} data 表格数据
 * @param {Object} lang 需要转换的语言 { name: 'en', value: 1 }
 * @param {String} filePath 转出文件路径
 */

function xlsxToJson({
  data,
  lang,
  filePath,
  fileName
}) {
  const obj = {}

  lang.forEach(({ name, value }) => {
    data.forEach((item, index) => {
      if (index > 0) {
        obj[item[0]] = item[value] ? item[value] : item[1]
      }
    })
  
    const path = `${filePath}/${name}/${fileName}.json`
    fs.writeFile(path, JSON.stringify(obj), err => {
      if (err) {
        console.log(err);
      } else {
        console.log('成功');
      }
    })
  })
}

module.exports = {
  xlsxToJson
}