/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-30 00:07:54
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 15:45:41
 */


<template>
 <transition name="slide" >
   <div class="add-song" v-show="showFlag"  @click.stop >
     <div class="header">
       <h1 class="title">添加歌曲到列表</h1>
       <div class="close" @click="hide"  >
         <i  class="icon-close" ></i>

       </div>

     </div>
      <div class="search-box-wrapper"  >
        <search-box  ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange" ></search-box>

      </div>
      <div class="shortcut" v-show="!query" >
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper" >


          <scroll class="list-scroll" ref="playHistoryScroll"  v-if="currentIndex === 0" :data="playHistory" >
            <div class="list-inner" >
              <song-list @select="selectSong" :songs="playHistory" ></song-list>
            </div>
          </scroll>

            <scroll :refreshDelay="refreshDelay" class="list-scroll" ref="searchHistory" v-if="currentIndex === 1" :data="searchHistory" >
              <div class="list-inner" >
               <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
              </div>
            </scroll>

        </div>
      </div>
      <div class="search-result" v-show="query" >
        <suggest
        :query="query"
        @listScrollBefore="blurInput"
        :showSinger="showSinger"
         @select="selectSuggest" ></suggest>
      </div>
      <top-tip ref="topTip">

        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">一首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
   </div>
 </transition>
</template>

<script type="text/ecmascriupt-6">
import { mapGetters, mapActions } from 'vuex'
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import Switches from 'base/switches/switches'
import Suggest from 'components/suggest/suggest'
import SongList from 'base/song-list/song-list'
import TopTip from 'base/top-tip/top-tip'
import Song from 'common/js/song'

import { searchMixin } from 'common/js/mixin'

export default {
  mixins: [searchMixin],
  data() {
    return {
      // 控制显示个隐藏
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }]
    }
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  methods: {
    showTip(){
      this.$refs.topTip.show()
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.playHistoryScroll.refresh()
        } else {
          this.$refs.searchHistory.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    search(query) {
      this.query = query
    },
    selectSuggest() {
      this.showTip()
      this.saveSearch()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song, index) {
      // 第一首歌曲为正在播放歌曲
      if (index !== 0) {
        this.inserSong(new Song(song))
        this.showTip()
      }
    },
    ...mapActions(['inserSong'])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: @color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: @font-size-medium;
      color: @color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: @font-size-medium;
      color: @color-text;
    }
  }
}
</style>

