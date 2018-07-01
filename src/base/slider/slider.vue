/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:01:53
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-03 22:35:10
 */
<template>
  <div class="slider" :class="{'scroll-no-init':!bscrollInit}" ref="slider" >
    <div class="slider-group" ref="sliderGroup" >
      <slot></slot>
    </div>
    <div class="dots">
      <span
      class="dot"
      v-for="(item,index) in dots"
      :key="index"
      :class="{active:currentPageIndex === index}"
      >
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascriupt-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  data() {
    return {
      bscrollInit: true,
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      // this.bscrollInit = true
      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 窗口大小改变
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }

      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },

  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      // 如果是无限循环轮播
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },

    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        bounce: false,
        stopPropagation: true,
        click: true
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
.slider {
  min-height: 1px;
  &.scroll-no-init {
    height: 0;
    min-height: 0;
  }
  .slider-group {
    position: relative;
    overflow: hidden;
    // 文本不会换行
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: @color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: @color-text-ll;
      }
    }
  }
}
</style>

