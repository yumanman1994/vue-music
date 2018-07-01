/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-22 21:41:39
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 22:16:08
 * @desc 排行榜页面歌曲列表
 */

<template>
  <transition name="slide" >
    <music-list :songs="songs" :rank="rank" :title="title" :bg-image="bgImage" ></music-list>

  </transition>
</template>

<script type="text/ecmascriupt-6">
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { processSongsUrl } from 'api/handlesongurl'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: [],
       rank:true
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if(this.songs.length){
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters(['topList'])
  },
  created() {
console.log(this.topList.id,'create')

    if(!this.topList.id){
      this.$router.push('/rank')
    }


    this._getDetail()

    // console.log(this.bgImage)
  },
  methods: {
    _getDetail() {
      getMusicList(this.topList.id)
      .then(res => {
        if(res.code ===ERR_OK){
            processSongsUrl(this._normalizeSongs(res.songlist)).then(
            songs => {
              this.songs = songs
            }
          )
          // console.log(res.songlist)
        }
      })

    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let musicData  = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
// .singer-detail {
//   position: fixed;
//   z-index: 100;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: @color-background;
// }
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

