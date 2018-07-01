/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-19 14:47:52
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-20 01:08:41
 */

<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick" >
    <div class="bar-inner" >
      <div class="progress" ref="progress" ></div>
      <div
      class="progress-btn-wrapper"
      ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend.prevent="progressTouchEnd"
       >
        <div class="progress-btn" ></div>
      </div>

    </div>

  </div>
</template>

<script type="text/ecmascriupt-6">
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')

const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressClick(e) {
      console.log(e.offsetX)
      // console.log(e.offsetX)
      // const offsetWidth = Math.min(
      //   Math.max(0, e.offsetX),
      //   this.$refs.progressBar.clientWidth
      // )
      const rect = this.$refs.progressBar.getBoundingClientRect()
      let offsetWidth = e.pageX - rect.left
      offsetWidth = Math.min(
        Math.max(0, offsetWidth),
        this.$refs.progressBar.clientWidth
      )

      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }

      const deltaX = e.touches[0].pageX - this.touch.startX

      const offsetWidth = Math.min(
        Math.max(0, this.touch.left + deltaX),
        this.$refs.progressBar.clientWidth
      )

      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      this.touch.initiated = false

      this._triggerPercent()
      // this.
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0 ,0)`
    }
  },
  watch: {
    percent(newPercent) {
      // console.log(newPercent)
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>


