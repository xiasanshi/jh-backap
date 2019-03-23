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
import {JHWebSocket} from './store/websocket'

Vue.use(VueWechatTitle)

Vue.use(Mint)
Vue.use(VueRouter)
// Vue.use(wxjs)
// 开启debug模式
Vue.config.debug = true
Vue.config.productionTip = true
localStorage.setItem('bussnessId', '19b97965dd4e4495a0e741abf9372a83')
Vue.prototype.$websocket = new JHWebSocket('ws://pay.qingzhao.net.cn/fanZone/webSocket')
router.beforeEach((to, from, next) => {
  console.log('main:' + next.name)
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  if (!sessionStorage.getItem('user') && to.path !== '/login') {
    next({path: '/login'})
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
