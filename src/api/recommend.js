import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'
export function getRecommend() {
  const url =
    'https://shc.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 获取歌单列表
export function getDiscList() {
  var url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}


// 获取歌单歌曲列表
export function getSongList(disstid) {
  let url = '/api/getCdInfo';

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
};





// g_tk:67232076
// inCharset:utf-8
// outCharset:utf-8
// notice:0
// format:json
// songmid:0016j8j527uqHq
// pcachetime:1524317041803
// platform:yqq
// hostUin:0
// needNewCode:0

// g_tk:1928093487
// inCharset:utf-8
// outCharset:utf-8
// notice:0
// format:json
// songmid:003v4UL61IYlTY
// pcachetime:1524317080030
// platform:yqq
// hostUin:0
// needNewCode:0
