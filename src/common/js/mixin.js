/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-21 01:42:04
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-07-01 18:46:15
 * @Desc 组件minxin
 */

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)

  },

  // keep-alive激活
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)

    }
  },
  methods: {
    // 如果组件里面没有实现 这个方法 就会执行minxin里面的这个方法 我们在这里抛出异常提示用户
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }

}


export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters(['playList', 'sequenceList', 'currentSong', 'mode', 'favoriteList'])

  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      console.log(mode)
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        // shuffle([1,23,4,5])
        // shuffle(this.sequenceList)
        // console.log(shuffle)
        console.log('random')
        list = shuffle(this.sequenceList)
        console.log(list)
      } else {
        console.log('loop or ')
        list = this.sequenceList
        console.log(list)
      }

      this.resetCurrentIndex(list)
      this.setPlayList(list)
      // console.log(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })

      this.setCurrentIndex(index)
      // console.log(index)
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'


    },
    toggleFavorite(song) {
      // console.log(this.favoriteList);
      // return
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)

      } else {
        this.saveFavoriteList(song)

      }



    },
    isFavorite(song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1


    },
    ...mapMutations({
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',

    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }

}


export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    // 保存搜索的历史记录
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    addQuery(query) {
      // return

      this.$refs.searchBox.setQuery(query)
    },

    // 列表滚动之前手气小键盘
    blurInput() {
      // console.log(this.$refs.searchBox)
      this.$refs.searchBox.blur()
    },
    onQueryChange(query) {
      this.query = query
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  }

}
