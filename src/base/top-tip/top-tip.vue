/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-06-30 16:07:02
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-30 16:28:10
 * @desc 顶部提示组件
 */


<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide"  >
      <slot></slot>

    </div>

  </transition>
</template>

<script type="text/ecmascriupt-6">
export default {
  props:{
    delay:{
      type:Number,
      default:2000
    }

  },
  data(){
    return {
      showFlag:false
    }
  },
  methods:{
    show(){
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      },this.delay)
    },
    hide(){
      this.showFlag = false
    }

  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';

.top-tip {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
  background: @color-dialog-background;
  &.drop-enter-active,
  &.drop-leave-active {
    transition: all 0.3s;
  }
  &.drop-enter,
  &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>

