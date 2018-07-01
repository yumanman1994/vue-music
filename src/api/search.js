/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-23 02:32:56
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-23 02:33:46
 * @desc 搜索页面请求
 */

import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getHotKey() {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });
  return jsonp(url, data, options);
};

export function getSearchResult(query, page, zhida, perpage) {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });
  return jsonp(url, data, options);
};
