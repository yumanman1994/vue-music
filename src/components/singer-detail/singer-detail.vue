/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-05 18:14:34
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-23 08:47:39
 * @Desc 歌手详情页面
 */

<template>
  <transition name="slide" >
    <music-list :songs="songs" :title="title" :bg-image="bgImage" ></music-list>

  </transition>
</template>

<script type="text/ecmascriupt-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { processSongsUrl } from 'api/handlesongurl'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  created() {
    this._getDetail()
    // console.log(this.bgImage)
  },
  methods: {
    _getDetail() {
      getSingerDetail(this.singer.id).then(res => {
        if (!this.singer.id) {
          this.$router.push('/singer')
        }
        if (res.code === ERR_OK) {
          // this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
          processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
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

