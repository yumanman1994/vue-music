/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-08 20:16:55
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 14:32:07
 * @定义同步操作
 */

import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state,topList){
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state,history){
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state,history){
    state.playHistory= history
  },
  [types.SET_FAVORITE_LIST](state,list){
    state.favoriteList = list
  }
}

export default mutations
