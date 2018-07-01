/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:01:49
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 11:15:26
 */
<template>
  <div class="m-header" >
    <div class="icon"></div>
    <h1 class="text">Chiken Music</h1>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine" ></i>
    </router-link>

  </div>
</template>
<script type="text/ecmascriupt-6" >
export default {}
</script>

<style   lang="less" scoped  >
@import '~common/style/variable';
@import '~common/style/minxin';
.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: @color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    .bg-image('logo');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: @font-size-large;
  }

  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: @color-theme;
    }
  }
}
</style>
