/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-08 20:16:28
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 15:14:43
 * @desc vuex状态
 */

import { playMode } from 'common/js/config'
import { loadSearch, loadPlay,loadFavorite } from 'common/js/cache'

const state = {
  // 歌手的数据
  singer: {},
  // 是否播放
  playing: false,
  // 播放器是够全屏
  fullScreen: false,

  playList: [],
  sequenceList: [],
  // 模仿的模式
  mode: playMode.sequence,
  // 当前播放的索引
  currentIndex: -1,
  disc: {},
  topList: {},
  //搜索历史
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlay(),
  // 喜欢的歌曲
  favoriteList:loadFavorite()
}

export default state
