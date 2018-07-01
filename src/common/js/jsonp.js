/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:09:33
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-02 22:09:56
 * @desc 对jsonp的封装 返回一个Promise实例
 */
import originJSONP from 'jsonp'

export default function jsonp (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    }
    )
  })
}

function param (data) {
  let url = ''
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let value = data[key] !== undefined ? data[key] : ' '
      url += `&${key}=${encodeURIComponent(value)}`
    }
  }

  return url ? url.substring(1) : ''
}
