// 深拷贝
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = deepCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

// 筛选ID组成数组
export function getIdList(tableDatas) {
  let delIdList = [];
  tableDatas.forEach((item) => {
    delIdList.push(item.id);
  });
  return delIdList;
}

//  重置数据
export function resetData(data) {
  let value = deepCopy(data);
  try {
    if (typeof value === "number") {
      return "";
    }
    if (typeof value === "string") {
      return "";
    }
    if (typeof value === "object") {
      for (const key in value) {
        if (Object.prototype.toString.call(value[key]) === "[object Number]") {
          value[key] = "";
        }
        if (Object.prototype.toString.call(value[key]) === "[object String]") {
          value[key] = "";
        }
        if (Object.prototype.toString.call(value[key]) === "[object Array]") {
          value[key] = [];
        }
        if (Object.prototype.toString.call(value[key]) === "[object Object]") {
          value[key] = resetData(value[key]);
        }
      }
      return value;
    }
  } catch (error) {
    console.log("重置数据出错了" + error);
    return "";
  }
}
// 判断一个对象在对象数组中是否存在
export function _isExitObj(jsonObj, jsonObjArr, keyName1, keyName2) {
  if (!jsonObjArr.length) {
    return false;
  }
  for (const item of jsonObjArr) {
    if (item[keyName2] === jsonObj[keyName1]) {
      return true;
    }
  }
  return false;
}
//检查json文件是否合法
export function _isJSON(str) {
  if (typeof str == "string") {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}
//检测Url是否合法
export function checkUrl(iframUrl) {
  return new Promise((resole, reject) => {
    const reg = new RegExp(/(http|https):\/\/([\w.]+\/?)\S*/);
    if (iframUrl === "") {
      reject("请输入地址。");
    } else if (!reg.test(iframUrl)) {
      reject("地址格式错误,格式应为http://...或https://...");
    } else {
      resole("正确");
    }
  });
}
// 获取当前时间 默认返回hh:mm:ss
export function getNowTime(type) {
  var date = new Date();
  let timeType = type ? type : "hh:mm:ss";
  let curYear = date.getFullYear();
  let curMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  let curDate = date.getDate().toString().padStart(2, "0");
  var curHour = date.getHours().toString().padStart(2, "0");
  var curMin = date.getMinutes().toString().padStart(2, "0");
  var curSec = date.getSeconds().toString().padStart(2, "0");
  switch (timeType) {
    case "hh:mm:ss":
      return `${curHour}:${curMin}:${curSec}`;
    case "yyyymmdd":
      return `${curYear}${curMonth}${curDate}`;
    case "yyyy-mm":
      return `${curYear}-${curMonth}`;
    case "yyyymmddhhmmss":
      return `${curYear}${curMonth}${curDate}${curHour}${curMin}${curSec}`;
    default:
      return `${curYear}${curMonth}${curDate}`;
  }
}

export function downloadZip(file, fileName) {
  var blob = new Blob([file], { type: "application/zip;charset=utf-8" });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}.zip`);
  } else {
    // 将lob对象转换为域名结合式的url
    let blobUrl = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = "none";
    link.href = blobUrl;
    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
    link.download = `${fileName}.zip`;
    // 自触发click事件
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
  return blob;
}

// 文件下载xlsx
export function downloadFile(file, fileName) {
  var blob = new Blob([file], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}.xlsx`);
  } else {
    // 将lob对象转换为域名结合式的url
    let blobUrl = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = "none";
    link.href = blobUrl;
    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
    link.download = `${fileName}.xlsx`;
    // 自触发click事件
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
}
// 文件下载docx
export function downloadWord(file, fileName) {
  var blob = new Blob([file], { type: "application/msword;charset=utf-8" });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}.docx`);
  } else {
    // 将lob对象转换为域名结合式的url
    let blobUrl = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = "none";
    link.href = blobUrl;
    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
    link.download = `${fileName}.docx`;
    // 自触发click事件
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
}
// 文件下载html
export function downloadHtml(file, fileName) {
  var blob = new Blob([file], { type: "application/msword;charset=utf-8" });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}.html`);
  } else {
    // 将lob对象转换为域名结合式的url
    let blobUrl = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = "none";
    link.href = blobUrl;
    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
    link.download = `${fileName}.html`;
    // 自触发click事件
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
}


/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
 export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * 获取时间间隔
 * @param startTime
 * @param endTime
 */
export function getTimeInterval(startDate, endDate = Date.now()) {
  if (arguments.length === 0) {
    return null
  }
  let startTime;
  let endTime;
  if (typeof startDate === 'object') {
    startTime = startDate.getTime();
  } else {
    startTime = startDate;
  }
  if (typeof endDate === 'object') {
    endTime = endDate.getTime();
  } else {
    endTime = endDate;
  }
  let dateInterval =  endTime - startTime;
  // //计算出相差天数
  let days = Math.floor(dateInterval / (24 * 60 * 60 * 1000));
  //计算小时数
  let hourLevel = dateInterval % (24 * 60 * 60 * 1000);
  let hours = Math.floor(hourLevel / (60 * 60 * 1000))
  //计算分钟数
  let minutesLevel = hourLevel % (60 * 60 * 1000);
  let minutes = Math.floor(minutesLevel / (60 * 1000));
  //计算秒数
  let seconds = Math.round((minutesLevel % (60 * 1000)) / 1000);
  return `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
