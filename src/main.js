
import Vue from 'vue'
import App from './App'
import router from './router'

// 重置样式
import './assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';
import  './assets/css/iconfont.css'
import VueAMap from 'vue-amap'

// 引入vuex状态层
import store from './store/index'

// 引入公共组件
import nav from './components/index'
import ElementUi from "element-ui"
import globalVar from "./utils/globalVar";

import { loadingFun } from "./utils/alert";



Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '83c9dde97091db85f7ca144302c515db',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4',
  uiVersion: '1.0.11' 
})


for (var i in nav) {
  Vue.component(i, nav[i])
}

Vue.prototype.globalVar = globalVar
Vue.prototype.$img = "http://192.168.3.11:80/"

// 引element-ui样式
// 使用该ui组件
Vue.use(ElementUi)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
