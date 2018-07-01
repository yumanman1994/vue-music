/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-12 21:34:50
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 14:56:34
 * @Desc 播放器组件
 */
<template>
  <div class="player" v-show="playList.length>0" >
    <!-- js动画钩子 -->
    <transition
    name="normal"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
     >
      <div class="normal-player" v-show="fullScreen">
          <div class="background" >
            <img width="100%" height="100%" :src="currentSong.image" >
          </div>
          <div class="top">
            <div class="back" @click="back" >
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer" ></h2>
          </div>
          <div class="middle"
          @touchstart="middleTouchStart"
          @touchmove="middleTouchMove"
          @touchend="middleTouchEnd"
           >
            <!-- 歌曲图片 -->
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper " ref="cdWrapper" >
                <div class="cd" :class="cdCls" >
                  <img class="image"  :src="currentSong.image" >
                </div>
              </div>

              <!-- 当前的歌词 -->
              <div class="playing-lyric-wrapper" >
                <div class="playing-lyric" >
                {{playingLyric}}
                </div>

              </div>


            </div>

            <!-- 歌词 -->
            <scroll
            class="middle-r"
            ref="lyricList"
            :data="currentLyric && currentLyric.lines" >
              <div class="lyric-wrapper" >
                <div v-if="currentLyric">
                  <p class="text"
                  ref="lyricLines"
                   v-for="(line,index) in currentLyric.lines"
                   :class="{'current':currentLyricLineNum === index}"
                    :key="index"
                     >
                    {{line.txt}}
                  </p>
                </div>
              </div>

            </scroll>


          </div>
          <div class="bottom">
            <!-- 标识 -->
            <div class="dot-wrapper">
              <span class="dot" :class="{'active':currentShow === 'cd'}" ></span>
              <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper" >
              <span class="time time-l" >{{ format(currentTime)}}</span>
              <div class="progress-bar-wrapper" >
                <progress-bar @percentChange="onPercentChange" :percent="percent"></progress-bar>

              </div>
               <span class="time time-r" >{{ format(currentSong.duration)}}</span>

            </div>
            <div class="operators">
              <div class="icon i-left">
                <i :class="iconMode" @click="changeMode" ></i>
              </div>
              <div class="icon i-left" :class="disableCls"  >
                <i class="icon-prev" @click="prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls"  >

                <i @click="togglePlaying"  :class="palyIcon"></i>
              </div>
              <div class="icon i-right" :class="disableCls"  >
                <i class="icon-next" @click="next"></i>
              </div>
              <div class="icon i-right" @click="toggleFavorite(currentSong)">
                <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
              </div>

            </div>
          </div>

        </div>
       </transition>

       <transition name="mini" >
        <div class="mini-player" v-show="!fullScreen" @click="open" >
            <div class="icon" >
              <img :class="cdCls" width="40" height="40"  :src="currentSong.image" >
            </div>
            <div class="text">
              <h2 class="name"  v-html="currentSong.name" ></h2>
              <p class="desc"  v-html="currentSong.singer" ></p>
            </div>
            <div class="control">
               <progress-circle :radius="radius" :percent="percent"  >
                  <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"  ></i>
                </progress-circle>

            </div>
            <div class="control" @click.stop="showPlayList" >
              <i class="icon-playlist"></i>

            </div>

          </div>
       </transition>
       <playlist ref="playlist" ></playlist>
       <audio
       ref="audio"
       @error="error"
       @canplay="ready"
       :src="currentSong.url"
       @timeupdate="updateTime"
       @ended="end"
       ></audio>


  </div>
</template>

<script type="text/ecmascriupt-6">
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import { mapGetters, mapMutations,mapActions } from 'vuex'
import ProgressBar from 'base/progress-bar/progress-bar'
import LyricParse from 'lyric-parser'
import ProgressCircle from 'base/progress-circle/progress-circle'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import {playerMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins:[playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLyricLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {
    //  this.$refs.audio.v
  },
  computed: {



    // iconMode() {
    //   return this.mode === playMode.sequence
    //     ? 'icon-sequence'
    //     : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    // },




    percent() {
      // console.log(this.currentTime / this.currentSong.duration)
      return this.currentTime / this.currentSong.duration
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    palyIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    ...mapGetters([
      'fullScreen',
      // 'playList',
      // 'currentSong',
      'playing',
      'currentIndex',
      // 'mode',
      // 'sequenceList'
    ])
  },
  methods: {
    showPlayList(){
      this.$refs.playlist.show()
    },
    middleTouchStart(e) {
      console.log('s')
      this.touch.initiaed = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      console.log('m')
      if (!this.touch.initiaed) {
        return
      }

      const touch = e.touches[0]
      // 这里要维护 x y轴的滚动偏差 当y轴的滚动偏差大于X轴的滚动偏差的时候不应该滚动
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }

      if (!this.touch.moved) {
        this.touch.moved = true
      }
      console.log(deltaX)

      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      )
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      console.log('e')
      this.touch.initiated = false
      let offsetWidth, opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          opacity = 0
          offsetWidth = -window.innerWidth
        }
      }

      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = '300ms'
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = '300ms'
    },
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          this.currentLyric = new LyricParse(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
          console.log(this.currentLyric)
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLyricLineNum = 0
        })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLyricLineNum = lineNum
      console.log(this.currentLyricLineNum)
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLines[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }

      this.playingLyric = txt
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek()
      }
    },
    // changeMode() {
    //   const mode = (this.mode + 1) % 3
    //   console.log(mode)
    //   this.setPlayMode(mode)

    //   let list = null
    //   if (mode === playMode.random) {
    //     // shuffle([1,23,4,5])
    //     // shuffle(this.sequenceList)
    //     // console.log(shuffle)
    //     console.log('random')
    //     list = shuffle(this.sequenceList)
    //     console.log(list)
    //   } else {
    //     console.log('loop or ')
    //     list = this.sequenceList
    //     console.log(list)
    //   }

    //   this.resetCurrentIndex(list)
    //   this.setPlayList(list)
    //   // console.log(list)
    // },
    // resetCurrentIndex(list) {
    //   let index = list.findIndex(item => {
    //     return item.id === this.currentSong.id
    //   })
    //   console.log(index)
    //   this.setCurrentIndex(index)
    //   // console.log(index)
    // },
    onPercentChange(percent) {
      console.log('changepercent')
      // console.log(percent)
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentSong.duration * percent * 1000)
      }
    },
    format(interval) {
      interval = Math.floor(interval)
      const minte = Math.floor(interval / 60)
      // const second = this._pad(interval % 60)
      const second = this._pad(interval % 60)

      // console.log(this._pad(second))
      return `${minte}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }

      return num
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    error() {
      this.songReady = true
    },


    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    next() {
      if (!this.songReady) {
        return
      }

      //如果列表歌曲长度为1 执行loop
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }

        this.setCurrentIndex(index)

        if (!this.playing) {
          this.togglePlaying()
        }
      }

      this.songReady = false
    },
    prev() {
      if (!this.songReady) {
        return
      }

      //如果列表歌曲长度为1 执行loop
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }

        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }

      this.songReady = false
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      // console.log(this._getPosAndScale())
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      // console.log(this.$refs.cdWrapper)
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'

    }),
    ...mapActions([
      'savePlayHistory'
    ]),
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

      return {
        x,
        y,
        scale
      }
    }
  },
  watch: {
    currentSong(newSong, oldSong) {


      if(!newSong.id){
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
     setTimeout(() => {
        // console.log(this.currentSong.url)
        this.$refs.audio.play()
        this.getLyric()
      },1000)

      //处理微信浏览器 后台微信不执行情况
    },
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.player {
  .normal-player {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: @font-size-large-x;
          color: @color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        .no-wrap();
        font-size: @font-size-large;
        color: @color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            //动画旋转
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
         .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
       .middle-r{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text{
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current{
              color: @color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
        .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot{
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @color-text-l;
          &.active{
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
   .progress-wrapper{
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time{
          color: @color-text;
          font-size: @font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l{
            text-align: left;
          }
          &.time-r{
            text-align: right;
          }
        }
        .progress-bar-wrapper{
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
         .icon
            {flex: 1;
            color: @color-theme;
            &.disable
              {color: @color-theme-d}
            i{font-size: 30px;}
            }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: @color-sub-theme;
        }
      }
    }

    &.normal-enter-active,&.normal-leave-active{
      transition: all 0.4s;
      .top,.bottom{
        transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
      }
    }
    &.normal-enter,&.normal-leave-to{
      opacity: 0;
      .top{
        transform: translate3d(0,-100px,0);

      }
      .bottom{
        transform: translate3d(0,100px,0);

      }
    }


  }
  .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: @color-highlight-background;

      .icon{
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
         img{
           border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
           }
      }

      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text;
        }
         .desc {
        .no-wrap();
        font-size: @font-size-small;
        color: @color-text-d;
         }
      }
      .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: @color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

     &.mini-enter-active,&.mini-leave-active{
  transition: all 0.4s;
    }
    &.mini-enter,&.mini-leave-to{
      opacity: 0;
    }

  }

  // 旋转动画
  @keyframes rotate {
    0%{
      transform: rotate(0)
    }

    100%{
      transform: rotate(360deg)
    }
  }

}
</style>

