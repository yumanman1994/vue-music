/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:01:24
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-22 16:19:12
 */
<template>
  <div class="singer" ref="singer" >
    <list-view ref="list"  @select="selectSinger" :listData="singers" ></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascriupt-6">
import { playListMixin } from 'common/js/mixin'
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'
import { ERR_OK } from 'api/config'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  mixins:[playListMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    // mixins里面定义要实现的方法
    handlePlayList(playLsit) {
      const bottom = playLsit.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singer
      this.$refs.list.refresh()
    },
    /**
     * 获取歌手列表数据
     */
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSingerList(res.data.list)
        }
      })
    },

    /**
     * @method
     * @augments list接口获取的商品列表的数据
     */
    _normalizeSingerList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          )
        }

        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      })

      // console.log(map)

      let ret = []
      let hot = []
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>

