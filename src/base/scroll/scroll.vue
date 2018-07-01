/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:02:06
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 01:34:46
 */
<template>
  <div ref="wrapper" >
    <slot></slot>
  </div>
</template>

<script type="text/ecmascriupt-6">
import BScroll from 'better-scroll'
export default {
  props: {
    // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
    // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
    // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
    // 如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    scrollBefore: {
      // 监听滚动开始前
      type: Boolean,
      default: false
    },
    refreshDelay:{
      type:Number,
      default:20

    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        pullUpLoad: this.pullUpLoad
      })

      // 监听btscroll事件滚动 事件 派发自定义事件
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', pos => {
          me.$emit('btscroll', pos)
        })
      }

      // 如果上拉刷新
      if (this.pullUpLoad) {
        let me = this
        this.scroll.on('pullingUp', pos => {
          me.$emit('pullingUp', pos)
        })
      }


      // 事件组件滚动之前 派发事件
      if(this.scrollBefore){
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('scrollBefore')
        })
      }






    },
    // 启用 better-scroll, 默认 开启。
    enable() {
      this.scroll && this.scroll.enable
    },
    // 作用：禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 高宽变化的时候去刷新scroll
    refresh() {
      console.log('refresh');

      this.scroll && this.scroll.refresh()
      // console.log('scroll refresh')
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    closePullUp() {
      this.scroll && this.scroll.closePullUp()
    }
  },
  updated() {
    console.log('updated')
  },
  watch: {
    data() {
      console.log(this.refreshDelay)
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style  lang="less" scoped >

</style>

