/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:52:28
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 16:17:40
 */

<template>
  <scroll
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @btscroll="btscroll"
   >
    <ul>
      <li ref="listGroup"  v-for="group in listData" :key="group.title" class="list-group" >
        <h2 class="list-group-title" >
          {{group.title}}

        </h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item" >
            <img class="avatar"  v-lazy="item.avatar" alt="">
            <span class="name" >{{item.name}}</span>
          </li>

        </ul>
      </li>

    </ul>
    <div class="list-shortcut"
    @touchstart="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove" >
      <ul>
        <li
        v-for="(item,index) in shortcutList"
        :data-index="index"
        :key="index"
        class="item"
        :class="{'current':currentIndex === index}"
         >
          {{item}}
        </li>
      </ul>

    </div>
    <div class="list-flxed" ref="flxed"  v-show="fixedTitle" >
      <h1 class="fixed-title" >
        {{fixedTitle}}
      </h1>
    </div>
    <div class="loading-container" v-show="!listData.length" >
          <loading></loading>
        </div>
  </scroll>
</template>

<script type="text/ecmascriupt-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
  },

  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.listData.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.listData[this.currentIndex]
        ? this.listData[this.currentIndex].title
        : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    listData() {
      // 歌手数据变化 重新计算高度
      // 数据渲染需要一定的时间 所以这里需要定时器
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newScrollY) {
      const listHeight = this.listHeight
      // 当滚动到顶部 newScrollY > 0
      if (newScrollY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length; i++) {
        // 当前这个歌手块的高度上限
        let height1 = listHeight[i]
        // 高度下限
        let height2 = listHeight[i + 1]

        // 中间部分滚动
        if (-newScrollY >= height1 && -newScrollY < height2) {
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.diff = height2 + newScrollY
          console.log(this.diff + 'diff----')
          return
        }
        // 滚动到最后一个元素
      }
      this.currentIndex = listHeight.length - 2
    },
    diff(newDiff) {
      console.log(newDiff + '------')
      let fixedTop =
        newDiff > 0 && newDiff < TITLE_HEIGHT ? newDiff - TITLE_HEIGHT : 0

      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.flxed.style.transform = `translate3d(0,${this.fixedTop}px,0)`
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = parseInt(getData(e.target, 'index'))
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let lastTouch = e.touches[0]
      this.touch.y2 = lastTouch.pageY
      console.log(this.touch)
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = this.touch.anchorIndex + delta
      // console.log(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    refresh(){
      this.$refs.listview.refresh()
    },
    btscroll(pos) {
      this.scrollY = pos.y
      console.log(pos.y)
    },
    _scrollTo(index) {
      // console.log(index)
      if (!index && index !== 0) {
        return
      }

      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }

      console.log(index)
      this.scrollY = -this.listHeight[index]
      //参数0=>是否需要滚动的动画
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      // console.log(this.listHeight)
      const list = this.$refs.listGroup

      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  destroyed() {
    // console.log(this.$refs.listview.scroll)
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: @color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    pad: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: @color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: @color-text-l;
      font-size: @font-size-small;
      &.current {
        color: @color-theme;
      }
    }
  }

  .list-flxed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
  }
  .loading-container {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }
}
</style>

