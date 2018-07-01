/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-24 22:59:15
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 15:32:17
 * @desc 缓存相关方法逻辑
 */


import storage from 'good-storage'
// import { deleteFavoriteList } from '../../store/actions';


const SEARCH_KEY = '__search__'
const PLAY_KEY = 'PLAY_KEY'
const PALY_MAX_LENGHT = 200
const SEARCH_MAX_LENGTH = 15

const FAVORITE_KEY = '_fevorite_'
const FAVORITE_MAX_LEN = 200

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)

  return searches


}


function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)

  if (index === 0) {
    return
  }

  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }

}


function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)

  if (index > -1) {
    arr.splice(index, 1)

  }

}


export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches


}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}


export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PALY_MAX_LENGHT)
  storage.set(PLAY_KEY, songs)
  return songs

}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}



export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)


  return songs
}

export function loadFavorite() {

  return storage.get(FAVORITE_KEY, [])

}



export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])


  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })

  storage.set(FAVORITE_KEY, songs)
  return songs


}



