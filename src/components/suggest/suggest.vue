/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-23 02:49:49
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-05-08 23:02:21
 */

<template>
  <scroll  class="suggest"
  :scrollBefore="true"
   @scrollBefore="scrollBefore"
    ref="suggest" :data="result"
    :pullUpLoad="pullUpLoad"
  @pullingUp="searchMore" >
  <div class="suggest-list-wrap" >
  <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)" >
        <div class="icon">
          <i :class="getIconCls(item)"></i>

          </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)" ></p>
        </div>
      </li>
    </ul>

    <div class="no-result-wrapper" v-show="!hasMore && !result.length" >

      <no-result title="抱歉，暂无搜索结果 !" ></no-result>
    </div>

    <div class="load-more-wrap" v-show="result.length" >
      <load-more :state="moreState" ></load-more>
    </div>

  </div>


  </scroll>
</template>

<script type="text/ecmascriupt-6">
import Scroll from 'base/scroll/scroll'
import LoadMore from 'base/load-more/load-more'
import NoResult from 'base/no-result/no-result'
import Singer from 'common/js/singer'

import { moreState } from 'common/js/config'
import { getSearchResult } from 'api/search'
import { processSongsUrl } from 'api/handlesongurl'
import { createSong } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'
import { ERR_OK } from 'api/config'

const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    // 是够能搜出歌手
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // show: false,
      moreState: moreState.hasMore,
      page: 1,
      result: [],
      pullUpLoad: {
        threshold: 40
      },
      hasMore: true
    }
  },
  methods: {
    scrollBefore() {
      // 列表滚动前
      this.$emit('listScrollBefore')
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })

        this.$router.push({
          path: `/search/${singer.id}`
        })

        this.setSinger(singer)
      } else {
        this.inserSong(item)
      }

      // 触发事件 保存搜索历史
      this.$emit('select', item)
    },
    refresh() {
      console.log('----refresh----')
      this.$refs.suggest.refresh()
    },
    searchMore() {
      console.log('searchMore')

      if (!this.hasMore) {
        this.$refs.suggest.finishPullUp()
        return
      } else {
        this.page++
        this.moreState = moreState.loading
        getSearchResult(this.query, this.page, this.showSinger, perpage)
          .then(res => {
            if (res.code === ERR_OK) {
              this.result = this.result.concat(this._getResult(res.data))
              this.checkMore(res.data)
              console.log(this.result)
            } else {
              this.page--
            }
          })
          .finally(() => {
            this.$refs.suggest.finishPullUp()
          })

        // this.$refs.suggest.finishPullUp()
      }
    },

    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    search() {
      this.moreState = moreState.hasMore
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      getSearchResult(this.query, this.page, this.showSinger, perpage).then(
        res => {
          if (res.code === ERR_OK) {
            this.result = this._getResult(res.data)
            this.checkMore(res.data)
            console.log(this.result)
          }
        }
      )
    },

    checkMore(data) {
      const song = data.song
      // console.log()
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.moreState = moreState.noMore
        this.hasMore = false
      }
    },

    _getResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }

      if (data.song) {
        let list = this._normalizeSongs(data.song.list)
        processSongsUrl(list).then(res => {
          list = res
        })

        // console.log(list)

        ret = ret.concat(list)
      }
      // console.log(ret)
      console.log(ret)
      return ret
    },

    _normalizeSongs(list) {
      // console.log(list)
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          // console.log(musicData)
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['inserSong'])
  },
  watch: {
    // 变化的时候请求服务端
    query() {
      this.search()
    },
    hasMore(newHasMore) {
      if (newHasMore) {
        this.moreState = moreState.hasMore
      } else {
        this.moreState = moreState.noMore
      }
    }
  },
  components: {
    Scroll,
    LoadMore,
    NoResult
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list-wrap {
    min-height: 100%;
    box-sizing: border-box;
    padding-block-end: 44px;
    position: relative;
    .suggest-list {
      padding: 0 30px;
      // height: 1000px;

      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^='icon-'] {
            font-size: 14px;
            color: @color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-d;
          overflow: hidden;
          .text {
            .no-wrap();
          }
        }
      }
    }

    .load-more-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 44px;
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

