/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-19 22:21:45
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-24 16:07:26
 * @Desc 工具函数
 */

/**
 * 返回作用域内的一个数字
 * @param {Number} min
 * @param {Number} max
 */
function getRomdomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


/**
 * 洗牌函数
 * @param {Array} arr
 */
export function shuffle(arr) {
  let _arr = arr.slice()

  for (let i = 0; i < _arr.length; i++) {
    let j = getRomdomInt(0, i);  // 要加逗号 下面是表达式
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]]
  }

  return _arr
}


export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay);

  }
}
