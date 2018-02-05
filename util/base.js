import sdk from "../vendor/qcloud-weapp-client-sdk/index";
const constants = {
  ERROR_HTTP_REQUEST: "ERROR_HTTP_REQUEST",
  ERROR_HTTP_RESULT: "ERROR_HTTP_RESULT",
  ERROR_HTTP_REQUEST_MESSAGE: "网络异常，请稍后重试",
  ERROR_COMMON: "小程序出了一点小问题",
  ERROR_JUMP_URL: "页面出了一点小问题，去其它页面看看吧",
  UNSUPPORT_DEFAULT: "您的微信版本较低无法使用此功能，请升级最新版微信哦",
  UNSUPPORT_SHARE: "您的微信版本较低无法使用此功能，请升级最新版微信哦。或者尝试点击页面右上角，转发小程序"
}
// 匹配图片服务器中图片地址的正则表达式 $0 图片路径, $1 协议, $2 域名 $3 图片相对路径
const REG_IMAGE_URL = /^(https?)\:\/\/([^\/]+)\/(.+\.[0-9a-z]+)/i;
// 小程序中页面同时打开数量的最大值
const MAXIMUM_PAGE_STACK = 5;

const noop = function () { };
const now = function now() {
  return new Date().getTime();
}

/**
 * 检查 jumpUrl 是否是应用中配置到tabBar上的路径，依赖于 appConfig 中标识的 tabBar 列表
 * 
 * @param {string} jumpUrl 
 */
const isTabBar = function isTabBar(jumpUrl,tabBar) {
  let tabar = tabBar;

  let urls = jumpUrl.match(/[^\/]+/g).join("/");
  if (!tabar) return false;
  for (let item in tabar) {
    if (tabar[item].indexOf(urls) !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function () {
    // 据上一次触发时间间隔
    var last = now() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

/**
 * 一个简单的属性合并的方法，将多个 source 对象的属性合并至 target
 * 
 * @export
 * @param {object} target
 * @returns 
 */
export function extend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * 返回一个数字指定精度的字符串
 * 
 * @export
 * @param {number} float 数字
 * @param {number} [digits=2] 小数点后的位数
 * @returns 
 */
export function getFloatString(float, digits = 2) {
  float = Number(float);
  float = isNaN(float) ? 0 : float;
  return float.toFixed(digits);
}

/**
 * 模拟 alert
 * 
 * @export
 * @param {any} content 
 */
export function alert(content, options = {}) {
  options = extend({
    title: "提示",
    content: content,
    showCancel: false
  }, options);

  wx.showModal(options);
}

/**
 * 模拟 confirm ，需要在 success 回调中对返回值进行判断，来确认用户点击了哪个按钮
 * confirm("确认执行该操作", function ({confirm, cancel}) { })
 * 
 * @export
 * @param {object} options 
 * @param {function} cbSuccess 
 * @param {function} cbFail 
 * @param {function} cbComplete 
 */
export function confirm(options = {}, cbSuccess = noop, cbFail = noop, cbComplete = noop) {
  cbSuccess = typeof cbSuccess == "function" ? cbSuccess : noop;
  cbFail = typeof cbFail == "function" ? cbFail : noop;
  cbComplete = typeof cbComplete == "function" ? cbComplete : noop;
  options = typeof options == "object" ? options : {
    title: "提示",
    content: options || "",
    success: cbSuccess,
    fail: cbFail
  }
  wx.showModal(options);
}

/**
 request({
      url: url,
      method: 'GET',
      login:true,
      success: (data, res) => {
        ...
      },
      complete: () => {
        ...
      }
  })
 * 封装了错误处理的 request 方法
 * 
 * @export
 * @param {any} options 
 * @param {boolean} options.login 是否需要登录，默认值为 true
 * @param {boolean} options.silent 是否禁用消息提示，默认值为 false
 */
export function request(options) {
  options = options || {};
  let silent = options.silent = typeof options.silent === "boolean" ? options.silent : false;
  let success = options.success || noop;
  let fail = options.fail || noop;

  options.success = function cbSuccess(res) {
    res = res.data;
    if (!res.success) {
      let err = new sdk.RequestError(constants.ERROR_HTTP_RESULT, res.message);
      options.fail(err, res);
      return;
    }
    success(res.data, res);
  }
  options.fail = function cbFail(err, res) {
    console.log(`请求失败：${JSON.stringify(err)}`);
    if (!err || !err.message) {
      err = new sdk.RequestError(constants.ERROR_HTTP_REQUEST, constants.ERROR_HTTP_REQUEST_MESSAGE);
    }
    if (!silent) {
      alert(err.message, {
        success () {
          fail(err, res);
        },
        fail () {
          fail(err, res);
        }
      });
    } else {
      fail(err, res);
    }
  }
  // 设置 login 的默认值
  options.login = typeof options.login == "boolean" ? options.login : true;
  sdk.request(options);
}

/**
 * 生成对应图片的缩略图地址
 * 
 * @export
 * @param {string} [url=""] 
 * @param {any} [{orient = true, mode = "thumbnail", width, height, quality = 70 }={}] 
 * @returns 
 */
export function getThumbnail(url = "", {
  orient = true,
  mode = "thumbnail",
  quality = 70,
  width,
  height
} = {}) {
  width = typeof width == "number" ? width : "";
  height = typeof height == "number" ? height : "";

  let result = REG_IMAGE_URL.exec(url);
  if (result && result.length) {
    result = [`${result[0]}?imageMogr2`];
    orient && result.push("auto-orient");
    mode && result.push(mode);
    (width || height) && result.push(`${width}x${height}`);
    quality && quality < 100 && result.push(`quality/${quality}`)
  } else {
    result = [url]
  }
  return result.join("/");
}

/**
 * 对 wxParse 的生成结果进行处理，暂时只对图片地址进行处理
 * 
 * @export
 * @param {any} result 
 */
export function parseWxParseResult(data) {
  function parseImage (nodes) {
    nodes.forEach(item => {
      if (item.node == "element" && item.tag == "img") {
        item.attr.src = getThumbnail(item.attr.src, {
          width: 1080
        });
      }
      item.nodes && parseImage(item.nodes);
    });
  }
  parseImage(data.nodes);
  // TODO 确认预览图片时是否需要压缩
  // 图片路径需要保持一致，否则 wx.previewImage 方法的调用会出现问题
  data.imageUrls = data.imageUrls.map(item => getThumbnail(item, {
    width: 1080
  }));
}

/**
 * 小程序内统一的页面跳转方法，处理打开五个页面后小程序内的页面跳转
 * 
 * @export
 * @param {string} [url=""] 
 * @param {boolean} [isRedirect=false] 非 tabBar 页面是否使用 redirectTo方法进行跳转
 * @param {any} [cb=noop] 跳转完成后的回调函数
 * @returns 
 */
// 当前正在执行的跳转动作对应的页面路径，此时再次跳转至相同页面时，阻止跳转
let navigatingUrl = "";
let jumpUrlTimeoutId = null;
export function jumpUrl(url = "", isRedirect = false, cb = noop, silent = false) {
  if (!url || navigatingUrl == url) return false;
  let currentPages = getCurrentPages();
  let stack = currentPages.length;  //页面栈
  let currentPage = currentPages[stack - 1];

  let path = getPath(url);
  let query = getQuery(url);
  let isTabar = isTabBar(path); //根目录暂无config配置
  isRedirect = isRedirect || query && query.isRedirect == "true";
  let success = function (res) {
    cb.call(null, res);
  }
  let fail = function (err) {
    !silent && alert(constants.ERROR_JUMP_URL);
    console.log(`[jumpUrl()]: 跳转失败, ${JSON.stringify(err)}`);
    cb.call(null, null, err);
  }
  // complete 回调执行时，页面开始执行跳转，此时再次点击按钮仍然会触发跳转。
  let complete = function () {
    jumpUrlTimeoutId = setTimeout(function () {
      navigatingUrl = "";
    }, 1000);
  }
  let jumpData = {
    url,
    success,
    fail,
    complete
  };
  navigatingUrl = url;
  jumpUrlTimeoutId && clearTimeout(jumpUrlTimeoutId);
  // TODO 调整路径对比的方法，需要支持路径参数
  try {
    if (isTabar) {
      wx.switchTab(jumpData);
    } else if (stack >= MAXIMUM_PAGE_STACK || isRedirect || url.indexOf(currentPage.route) != -1) {
      wx.redirectTo(jumpData);
    } else {
      wx.navigateTo(jumpData);
    }
  } catch (err) {
    complete();
  }
}

/**
 * 数组去重，暂时只支持元素为对象的数组的去重
 * 
 * @export
 * @param {any} list 
 * @param {any} key 标识对象唯一性的属性的名称
 * @returns 
 */
export function deduplicate (list, key = "id") {
  if (!Array.isArray(list) || !key) {
    console.log(`list: ${list}, key: ${key}`);
    return [];
  }
  list = Array.from(new Map(list.map(item => [item[key], item])).values());
  return list;
}

/**
 * 日期格式化
 * 
 * @export
 * @param {any} date 
 * @param {string} [format="yyyy-MM-dd"]
 */
export function formatDate (date, fmt = "yyyy-MM-dd") {
  if (date instanceof Date) {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  } else {
    fmt = "";
  }
  return fmt;
}

/**
 * 查询字符串转换为对象的查询对象
 * 
 * @export
 * @param {string} queryString 
 * @returns 
 */
export function queryStringToObj (queryString) {
  if (!queryString) return null;
  let result = queryString.split("&");
  result = result.reduce((memo, item) => {
    item = item.split("=");
    if (item.length == 2) {
      memo[item[0]] = item[1];
    }
    return memo;
  }, {});
  return result;
}

export function getPath (url = "") {
  let result = url.split("?");
  result = result.length ? result[0] : "";
  return result;
}

export function getQuery (url = "") {
  let result = url.split("?");
  result = result.length > 1 ? result[1] : "";
  return queryStringToObj(result);
}

/**
 * 跳转至对应小程序的指定页面
 * 
 * @export
 * @param {string} option.appId
 * @param {string} option.path
 * @param {string} option.envVersion 打开小程序的版本 (develop/trial/release)
 */
export function navigateToMiniProgram (option) {
  extend(option, {
    success () {
      console.log(`[navigateToMiniProgram()]: navigate to ${option.appId} success`);
    },
    fail (errMsg) {
      alert(constants.ERROR_COMMON);
      console.log(`[navigateToMiniProgram()]: ${errMsg}`);
    }
  });
  if (typeof wx.canIUse == "function" && wx.canIUse("navigateToMiniProgram")) {
    wx.navigateToMiniProgram(option);
  } else {
    alert(constants.UNSUPPORT_DEFAULT);
  }
}