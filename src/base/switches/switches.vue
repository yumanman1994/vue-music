/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-05-08 23:34:33
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-06-29 01:31:08
 */

<template>
  <ul class="switches" >
    <li
    class="switch-item"
    v-for="(item,index) in switches"
    :key="index"
    :class="{'active':currentIndex === index}"
    @click="selectItem(index)"




    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascriupt-6">
export default {
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    selectItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';

.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid @color-highlight-background;
  border-radius: 5px;
  .switch-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: @font-size-medium;
    color: @color-text-d;
    &.active {
      background: @color-highlight-background;
      color: @color-text;
    }
  }
}
</style>

