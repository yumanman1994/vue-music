/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-23 02:23:15
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-05-08 23:09:46
 */

<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="input" type="text" v-model="query" class="box" :placeholder="placeholder" >
    <i @click="clear" class="icon-dismiss" v-show="query" ></i>

  </div>
</template>

<script type="text/ecmascriupt-6">
import { debounce } from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      // console.log(query)
      this.query = query
    },
    blur() {
      this.$refs.input.blur()
    }
  },
  created() {
    // 为什么不在watch里面写
    this.$watch(
      'query',
      debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 200)
    )
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: @color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: @color-background;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: @color-highlight-background;
    color: @color-text;
    font-size: @font-size-medium;
    outline-color: gold;
    &::placeholder {
      color: @color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: @color-background;
  }
}
</style>

