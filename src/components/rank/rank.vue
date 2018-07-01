/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:01:44
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 22:15:59
 */
<template>
  <div class="rank" ref="rank" >
    <scroll :data="topList"  class="toplist" ref="toplist" >
      <ul>
        <li class="item" v-for="(item ,i) in topList" :key="i"  @click="selectItem(item)" >
          <div class="icon" >
              <img width="100" height="100" v-lazy="item.picUrl" >
          </div>

          <ul class="songlist" >
          <li class="song " v-for="(song,index) in item.songList" :key="index" >
            <span>{{index +1}}</span>
            <span>{{song.songname}}-{{song.sngername}}</span>
          </li>

        </ul>
        </li>

      </ul>
      <div class="loading-container" v-show="!topList.length" >
      <loading></loading>
    </div>
    </scroll>
    <router-view></router-view>
  </div>

</template>
<script type="text/ecmascriupt-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import { getRankList } from 'api/rank'

import { ERR_OK } from 'api/config'
export default {
  mixins: [playListMixin],
  created() {
    // setTimeout
    this._getRankList()
  },
  data() {
    return {
      topList: []

    }
  },
  methods: {
    // mixins里面定义要实现的方法
    handlePlayList(playLsit) {
      const bottom = playLsit.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
      // this.$refs.recommend.style.bottom = bottom
      // this.$refs.scroll.refresh()
    },
    selectItem(item){
      this.$router.push({
        path:`/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getRankList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList:'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: @color-highlight-background;
        color: @color-text-d;
        font-size: @font-size-small;
        .song {
          .no-wrap();
          line-height: 26px;
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
