<template>
  <div id="app" @touchmove.prevent>
   <m-header></m-header>
   <tab></tab>
   <!-- 缓存dom到内存中 -->
   <keep-alive>
    <router-view>
    </router-view>
   </keep-alive>
    <player/>
  </div>
</template>

<script type="text/ecmascript-6" >
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>
<style  lang="less" scoped  >

</style>
