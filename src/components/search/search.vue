/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-02 22:01:37
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 01:42:27
 * @desc 搜索页面
 */
<template>
  <div class="search">
      <div class="search-box-wrapper">
        <search-box @query="onQueryChange"  ref="searchBox" ></search-box>

      </div>
      <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query"  >
        <scroll :refreshDelay="refreshDelay" class="shortcut"  :data="shortcut" ref="shortcut" >


          <div>
                <div class="hot-key" >
                  <h1 class="title" >热门搜索</h1>
                  <ul>
                    <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index" >
                      <span>{{item.k}}</span>

                    </li>
                  </ul>
                </div>
                <div class="search-history" v-show="searchHistory.length" >
                  <h1 class="title" >

                    <span class="text" >搜索历史</span>
                    <span class="clear" @click="showConfirm" >
                      <i class="icon-clear" ></i>
                    </span>
                  </h1>
                  <search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
                </div>
          </div>

        </scroll>

      </div>
      <div class="search-result" v-show="query" ref="searchResult" >
        <suggest  @listScrollBefore="blurInput" ref="suggest" @select="saveSearch" :query="query" ></suggest>

      </div>
      <confirm @confirm="clearSearch"  text="是否删除所有搜索历史" ref="confirm" />
      <router-view></router-view>
  </div>
</template>

<script type="text/ecmascriupt-6">
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import { playListMixin, searchMixin } from 'common/js/mixin'

import Confirm from 'base/confirm/confirm'
import Suggest from 'components/suggest/suggest'
import { mapActions } from 'vuex'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'

export default {
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotKey: [],
      // query:''
    }
  },
  created() {
    this._getHotKey()
  },

  methods: {
    // mixins里面定义要实现的方法
    handlePlayList(playLsit) {
      const bottom = playLsit.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },

    showConfirm() {
      this.$refs.confirm.show()
    },
    clearSearch() {
      this.clearSearchHistory()
    },

    deleteOne(item) {
      // console.log(item)
      this.deleteSearchHistory(item)
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code == ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      // 'saveSearchHistory',

      'clearSearchHistory'
    ])
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        // console.log('--------fdfdfd-----')
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style  lang="less" scoped >
@import '~common/style/variable';
@import '~common/style/minxin';
.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: @color-highlight-background;
          font-size: @font-size-medium;
          color: @color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: @font-size-medium;
          color: @color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            .extend-click();
            .icon-clear {
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>

