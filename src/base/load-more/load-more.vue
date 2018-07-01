/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-23 20:18:47
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-23 20:59:08
 */

<template>
  <div class="load-more" >
    <p class="text" v-show="state === 2" >
      {{hasMoreTitle}}
    </p>
    <p class="text" v-show="state === 1" >
      {{noMoreTitle}}
    </p>
    <loading :title="loadingTitle" v-show="state === 0" ></loading>
  </div>
</template>

<script type="text/ecmascriupt-6">
import { moreState } from 'common/js/config'
import Loading from 'base/loading/loading'

export default {
  props: {
    loadingTitle: {
      type: String,
      default: '加载中...'
    },
    state: {
      type: Number,
      default: moreState.hasMore
    },
    noMoreTitle:{
      type:String,
      default:'暂无更多'
    },
    hasMoreTitle:{
      type:String,
      default:'下拉加载更多'
    },


  },
  components:{
    Loading
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';

.load-more{
  height: 44px;
  p.text{
    line-height: 44px;
    font-size: @font-size-small;
    color: @color-text-l;
    text-align: center;
  }
}
</style>

