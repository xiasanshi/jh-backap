/**
 * ----------------------------------------------------------
 * 一些公共函数的封装，为了一些函数，就不引入新的库了
 *
 * @version  1.0
 * @author shaqihe(shaqihecome@163.com)
 *
 * @module src/common/util/tool
 * ----------------------------------------------------------
 */

let tool = {}

/**
 * 取窗口滚动条高度
 */
tool.getScrollTop = () => {
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

/**
 * 获取时间戳
 */
tool.getTimestamp = () => {
  return new Date().getTime()
}

export default tool

tool.weatherScrollUp = (e) => {
  let startY, endY
  e = e || window.event
  if (e.wheelDelta) { // 第一步：先判断浏览器IE，谷歌滑轮事件
    if (e.wheelDelta > 0) { // 当滑轮向上滚动时
      console.log('滑轮向上滚动')
    }
    if (e.wheelDelta < 0) { // 当滑轮向下滚动时
      console.log('滑轮向下滚动')
    }
  } else if (e.detail) { // Firefox滑轮事件
    if (e.detail > 0) { // 当滑轮向上滚动时
      console.log('滑轮向上滚动')
    }
    if (e.detail < 0) { // 当滑轮向下滚动时
      console.log('滑轮向下滚动')
    }
  }
}
