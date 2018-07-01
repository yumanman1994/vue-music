/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-08 20:17:31
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 15:34:11
 * @异步获取的封装  一般是异步操作 或者是多个mutation 的封装
 */
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay,saveFavorite ,deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  console.log(song, '-')
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

/**
 * @description 一个播放的动作 封装多个mutation
 * @param {*} param0
 * @param {*} param1
 */
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}


export const randomPlay = function ({ commit, state }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)


}


/**
 * @description搜索列表点击一首歌
 * @param {*} param0
 * @param {*} song
 */


export const inserSong = function ({ commit, state }, song) {
  console.log('inserSong')
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录当前歌曲的
  let currentSong = playList[currentIndex]

  // 查询播放列表中是否有你点击的那首歌曲
  let fpIndex = findIndex(playList, song)

  //插入歌曲  增加索引
  currentIndex++
  playList.splice(currentIndex, 0, song)
  //如果已经包含这首歌
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--

    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }


  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let sfIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  //如果已经包含这首歌
  if (sfIndex > -1) {
    if (currentSIndex > sfIndex) {
      sequenceList.splice(sfIndex, 1)
    } else {
      sequenceList.splice(sfIndex + 1, 1)
    }



  }



  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)

  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))

}


export const deleteSearchHistory = function ({ commit }, query) {
  // console.log(query)
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}




export const clearSearchHistory = function ({ commit }) {
  // console.log(query)
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}


/**
 * @description播放列表删除一首歌曲
 * @param {*} param0
 * @param {*} song
 */
export const deleteSong = function ({ commit, state }, song) {

  // console.log(song)
  // return
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }


  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
  // if (!playList.length) {
  //   commit(types.SET_PLAYING_STATE, false)
  // }else{
  //   commit(types.SET_PLAYING_STATE, true)
  // }


}

/**
 * @description 清空播放列表
 * @param {*} param0
 */
export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)

}


export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))


}

// 收藏

export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))

}

export const deleteFavoriteList = function({commit},song) {
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))

}



