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
import VueWechatTitle from 'vue-wechat-title'
import {MiniApp} from './api/api'
import {Api} from './api/index'
import {Printer} from './common/util/printer'

Vue.use(VueWechatTitle)

Vue.use(Mint)
Vue.use(VueRouter)

// 开启debug模式
Vue.config.debug = true
Vue.config.productionTip = true
localStorage.setItem('bussnessId', '19b97965dd4e4495a0e741abf9372a83')

let printer = new Printer()
Vue.prototype.$printer = printer
console.log('run main')
let url = 'https://diancan.qingzhao.net.cn/diancanrs'
Vue.prototype.$api = new Api(url)
Vue.prototype.$miniapi = new MiniApp(url)
Vue.prototype.$orderFlag = 0
router.beforeEach((to, from, next) => {
    // console.log('main:' + next.name)
    if (to.path === '/login') {
        localStorage.removeItem('shopInfo')
    }
    if (!localStorage.getItem('shopInfo') && to.path !== '/login') {
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
