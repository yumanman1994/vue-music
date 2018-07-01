/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:02:09
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-08 20:56:21
 */
<template>
  <div class="loading" >
    <img width="24" height="24" src="./loading.gif">
    <p class="desc" >{{title}}</p>
  </div>
</template>

<script type="text/ecmascriupt-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
.loading {
  width: 100%;
  text-align: center;
  .desc {
    line-height: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
  }
}
</style>

