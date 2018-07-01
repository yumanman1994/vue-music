/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:01:40
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 19:35:21
 */
<template>
  <div class="recommend" ref="recommend" >
    <scroll ref="scroll" class="recommend-content" :data="discList" >
      <div>
          <div v-if="recommends.length" class="slider-wrapper" >
            <slider>
            <div v-for="(item,index) in recommends" :key="index" >
              <a :href="item.linkUrl" >
                <img @load="loadImg" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li class="item" v-for="(item,index) in discList" :key="index" @click="selectItem(item)" >
            <div class="icon" >
              <img width="60" height="60" v-lazy="item.imgurl" alt="">

            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname" ></p>
            </div>

          </li>
        </ul>
      </div>

        </div>
        <div class="loading-container" v-show="!discList.length" >
          <loading></loading>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascriupt-6">
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { playListMixin } from 'common/js/mixin'
import {mapMutations} from 'vuex'

import { ERR_OK } from 'api/config'
export default {
  mixins: [playListMixin],

  data() {
    return {
      recommends: [],
      discList: [],
      sliderImgLoad: false
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()

    window.addEventListener('scroll', () => {
      console.log('scroll')
    })
  },
  methods: {
     // mixins里面定义要实现的方法
    handlePlayList(playLsit) {
      const bottom = playLsit.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()

    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImg() {
      if (!this.sliderImgLoad) {
        this.$refs.scroll.refresh()
        this.sliderImgLoad = true
      }
    },
...mapMutations({
  setDisc:'SET_DISC'
})
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 20px;
          overflow: hidden;
          font-size: @font-size-medium;
          .name {
            margin-bottom: 10px;
            color: @color-text;
          }
          .desc {
            color: @color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
    }
  }
}
</style>

