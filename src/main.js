import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store'
import './common/util/common_samplify.css'
import './common/util/common.css'
import './assets/scss/iconfont/iconfont.css'
// import 'assets/scss/iconfont/iconfont.css'
import VueWechatTitle from 'vue-wechat-title'
// import {JHWebSocket} from './store/websocket'
import {MiniApp} from './api/api'
import {Api} from './api/index'
// import {PosMachine} from './common/util/posstyle'

Vue.use(VueWechatTitle)

Vue.use(Mint)
Vue.use(VueRouter)
// Vue.use(wxjs)
// 开启debug模式
Vue.config.debug = true
Vue.config.productionTip = true
localStorage.setItem('bussnessId', '19b97965dd4e4495a0e741abf9372a83')
// 链接打印机
// let ips = localStorage.getItem('posIp')
// let ports = localStorage.getItem('posPort')
// Vue.prototype.$pos = new PosMachine(ips, ports)
Vue.prototype.$pos = false
let url = 'https://diancan.qingzhao.net.cn/diancanrs/'
Vue.prototype.$api = new Api(url)
Vue.prototype.$miniapi = new MiniApp(url)
// Vue.prototype.$shopId = '1'
// Vue.prototype.$brandId = '2'
router.beforeEach((to, from, next) => {
  console.log('main:' + next.name)
  if (to.path === '/login') {
    sessionStorage.removeItem('shopInfo')
  }
  if (!sessionStorage.getItem('shopInfo') && to.path !== '/login') {
    next({path: '/login'})
  } else {
    // let shopInfo = JSON.parse(sessionStorage.getItem('shopInfo'))
    // this.$shopId = shopInfo.shopId
    // Vue.prototype.$shopId = shopInfo.shopId
    next()
  }
})
// Vue.prototype.$websocket = new JHWebSocket('wss://pintuan.fanzone.vip/fanZone/webSocket') // websocket
// Vue.prototype.$websocket = new JHWebSocket('ws://192.168.43.216:8082/fanZone/webSocket') // websocket
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
