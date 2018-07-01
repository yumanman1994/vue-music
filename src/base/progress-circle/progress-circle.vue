/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-19 20:29:22
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-19 21:07:52
 * @Desc 圆形进度条
 */


<template>
 <div class="progress-circle" >
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1"
    xmlns="http://www.w3.org/2000/svg">

      <circle class="progress-background" cx="50" cy="50" r="50"
          fill="transparent"
      />
      <circle class="progress-bar" cx="50" cy="50" r="50"
          fill="transparent"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"

      />


    </svg>
    <slot></slot>


 </div>
</template>

<script type="text/ecmascriupt-6">
export default {
  props:{
    radius:{
      type:Number,
      default:100
    },
    percent:{
      type:Number,
      default:0
    }
  },
  data(){
    return{
      dashArray:Math.PI *100
    }
  },
  computed:{
    dashOffset(){
      return (1-this.percent) * this.dashArray
    }
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
.progress-circle {
  position: relative;
  circle {
    // 轮廓宽度
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: @color-theme-d;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: @color-theme;
    }
  }
}
</style>

