/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-08 22:54:51
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 22:15:19
 * @desc
 */

<template>
  <div class="music-list" >
    <div  class="back" @click="back" >
      <i class="icon-back" ></i>
    </div>

    <h1 class="title" v-html="title" ></h1>
    <div class="bg-image" ref="bgImage"  :style="bgStyle" >
      <div class="play-wrapper" >
        <div class="play" ref="playBtn"  v-show="songs.length > 0" @click="random"  >
          <i class="icon-play" ></i>
          <span class="text" >随机播放</span>
        </div>

      </div>
      <div class="filter" ref="filter" > </div>

    </div>
    <div class="bg-layer" ref="layer" ></div>
    <scroll
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    class="list"
    ref="list"
    @btscroll="btscroll"
    >
      <div class="song-list-wrapper" >
        <song-list @select="selectItem" :rank="rank"  :songs="songs"></song-list>
      </div>

      <div class="loading-container" v-show="!songs.length" >
        <loading></loading>
        </div>
    </scroll>


  </div>
</template>

<script type="text/ecmascriupt-6">
import { mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { playListMixin } from 'common/js/mixin'
import { prefixStyle } from 'common/js/dom'
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
// const transform

export default {
  mixins: [playListMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    // 动态设置列表的高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranlateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    // mixins里面定义要实现的方法
    handlePlayList(playLsit) {
      const bottom = playLsit.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    random() {
      this.randomPlay({ list: this.songs })
    },
    selectItem(song, index) {
      this.selectPlay({ list: this.songs, index })
    },
    btscroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    console.log(this.songs)
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranlateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      // this.$refs.layer.style[
      //   'webkitTransform'
      // ] = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      if (newY < this.minTranlateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      // this.$refs.bgImage.style['webkiTtransform'] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: @color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    .no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
    }
    .play {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid @color-theme;
      color: @color-theme;
      border-radius: 100px;
      font-size: 0;
    }
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: @font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: @font-size-small;
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: @color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @color-background;
    // overflow: hidden;
    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>

