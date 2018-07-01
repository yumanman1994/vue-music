/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-09 20:23:02
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 22:28:12
 */

<template>
<div class="song-list" >
  <ul>
    <li
    v-for="(song,index) in songs"
    :key="index"
    class="item"
    @click="selectItem(song,index)"
    >
      <div class="rank-item" v-show="rank" >
        <span :class="getRankCls(index)" v-text="getRankText(index)" ></span>

      </div>
      <div class="content" >
        <h2 class="name" >
          {{song.name}}
        </h2>
        <p class="desc" >{{getDesc(song)}}</p>
      </div>


    </li>

  </ul>

</div>
</template>

<script type="text/ecmascriupt-6">
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getRankCls(index) {
      if(index <= 2){
        return `icon icon${index}`
      }else{
        return 'text'
      }
    },
    getRankText(index) {
      if(index>2){
        return index+1
      }
    },
    selectItem(song, index) {
      this.$emit('select', song, index)
    },
    getDesc(song) {
      return `${song.singer}-${song.album}`
    }
  },
  created() {
    // console.log(this.songs)
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.song-list{
  .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: @font-size-medium;
    .rank-item{
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon{
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0{
          .bg-image('first');
        }
        &.icon1{
          .bg-image('second');
        }
        &.icon2{
          .bg-image('third');
        }
      }
      .text{
        color: @color-theme;
        font-size: @font-size-large;
      }
    }
    .content{
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        .no-wrap();
        color: @color-text;
      }
      .desc{
        .no-wrap();
        margin-top: 4px;
        color: @color-text-d;
      }
    }
  }
}
</style>

