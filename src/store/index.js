/*
 * @Author: 余小蛮-1029686739@qq.com
 * @Date: 2018-04-08 20:16:07
 * @Last Modified by: 余小蛮-1029686739@qq.com
 * @Last Modified time: 2018-04-08 20:57:12
 * @desc vuex入口
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 打印修改日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // 调试工具 开发模式开启
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
