/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-20 20:10:06
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-23 15:45:53
 */
import { Base64 } from 'js-base64'
import { getLyric } from 'api/getLyric'
import { ERR_OK } from 'api/config'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.name = name
  }

  getLyric() {
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve,reject) => {
      getLyric(this.id).then((res) => {
        // console.log(res)
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }

}

export function createSong(musicData) {
  return new Song({
    id: musicData.songmid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url:'http://dl.stream.qqmusic.qq.com/C400002ss1uk0YuoXX.m4a?guid=8500370400&vkey=34A4028E15177621032FB9FA5DC2A11A56F92A310D2F1DD848935FE6C776643B8DA64E07ABB8DD8369290EEC11E1B6725C853D0FCFC1F26F&uin=0&fromtag=38'

  })
}

// 处理一首歌是两个歌手的边界值操作
 export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }

  singer.forEach(s => {
    ret.push(s.name)
  })

  return ret.join('/')
}
